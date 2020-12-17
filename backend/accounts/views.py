"""
Views of accounts
"""
import json
from json import JSONDecodeError
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    JsonResponse,
)
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from .models import DailyRecord
import datetime
from article.recommend import *

User = get_user_model()

def getWeeklyScore(user):
    score = 0
    for dr in user.drs.filter(date__gte=datetime.datetime.now()-datetime.timedelta(days=6),
                            date__lte=datetime.datetime.now()):
        score += dr.score
    return score

def getRanking(user, weekly=False):
    if (weekly):
        weekly_score = getWeeklyScore(user)
        return len( list(filter(lambda user: getWeeklyScore(user) > weekly_score, User.objects.all())) )+1
    user_rank = User.objects.filter(score__gt=user.score).count()+1
    return user_rank


@ensure_csrf_cookie
def token(request):
    """
    Return CSRF token.

    In **GET**: Returns a CSRF token

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response with CSRF token
    :rtype: HttpResponse

    """
    if request.method == "GET":
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(["GET"])


@ensure_csrf_cookie
def signup(request):
    """
    Create account.

    In **POST**: Create a new account

    POST parameters:
        POST['username']: Unique username
        POST['email']: Email address
        POST['password']: Password

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response
    :rtype: HttpResponse

    """
    if request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            username = req_data["username"]
            email = req_data["email"]
            password = req_data["password"]
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        try:
            user = User.objects.create_user(email, username, password=password)
        except IntegrityError:
            return HttpResponse(status=409)
        login(request, user)
        return JsonResponse(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "score": user.score,
                "weekly_score": getWeeklyScore(user),
                "recommendation_list": get_recommendation_list(user)[:3],
            },
            safe=False,
            status=201,
        )
    else:
        return HttpResponseNotAllowed(["POST"])


@ensure_csrf_cookie
def signin(request):
    """
    Log in to the provided account.

    In **GET**: Get login status
    In **POST**: Log in to the account

    POST parameters:
        POST['email']: Unique email
        POST['password']: Password

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response
    :rtype: HttpResponse

    """
    if request.method == "GET":
        if request.user.is_authenticated:
            user = request.user
            return JsonResponse(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "score": user.score,
                    "weekly_score": getWeeklyScore(user),
                    "recommendation_list": get_recommendation_list(user)[:3],
                },
                safe=False,
                status=200,
            )
        else:
            return HttpResponse(status=200)
    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            email = req_data["email"]
            password = req_data["password"]
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse(
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "score": user.score,
                    "weekly_score": getWeeklyScore(user),
                    "recommendation_list": get_recommendation_list(user)[:3],
                },
                safe=False,
                status=200,
            )
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


@ensure_csrf_cookie
def signout(request):
    """
    Log out from the current account.

    In **GET**: Log out from the account

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response
    :rtype: HttpResponse

    """
    if request.method == "GET":
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(["GET"])


def addScore(user, score):
    """
    Add score to selected user
    """
    existing_records = user.drs.filter(date=datetime.datetime.now(), user=user)
    if (len(existing_records) == 0):
        record = DailyRecord(user=user, score=score)
        user.score += score
        user.save()
        record.save()
        return
    else:
        record = existing_records[0]
        record.score += score
        user.score += score
        user.save()
        record.save()
        return


def getScores(user, days=1):
    """
    Get recent [days] scores from selected user
    """
    output = {}
    for date in (datetime.datetime.now()-datetime.timedelta(days=days-1) + datetime.timedelta(n) for n in range(days)):
        output[(date.strftime("%Y-%m-%d"))] = {
            "day": date.weekday(),
            "score": 0
        }
    records = DailyRecord.objects.filter(date__gte=datetime.datetime.now()-datetime.timedelta(days=days-1),
                                         date__lte=datetime.datetime.now(), user=user)
    for record in records:
        output[str(record.date)]["score"] = record.score

    # output = list(map(lambda record: {
    #     "date": record.date,
    #     "day": record.date.weekday(),
    #     "score": record.score,
    # }, records))

    return output


@login_required
def user_scores(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            user = request.user
            scores = getScores(user, 7)
            return JsonResponse(
                scores,
                safe=False,
                status=200,
            )
        else:
            return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(["GET"])


@login_required
def user_ranking(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            user = request.user
            return JsonResponse(
                {
                    "rank": getRanking(user),
                    "weeklyRank": getRanking(user, True),
                    "total_user_num": User.objects.all().count(),
                }
            )
        else:
            return HttpResponse(status=200)
    else:
        return HttpResponseNotAllowed(["GET"])
