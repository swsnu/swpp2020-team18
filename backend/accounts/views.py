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
from .models import DailyRecord
import datetime

User = get_user_model()


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
    existing_records = user.drs.filter(date=datetime.datetime.now())
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
    records = DailyRecord.objects.filter(date__gte=datetime.datetime.now()-datetime.timedelta(days=days-1),
                                         date__lte=datetime.datetime.now())
    
    output = list(map(lambda(record: {
        "date": record.date,
        "score": record.score,
    }), records))
    
    return output


