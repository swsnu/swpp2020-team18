from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
import json
from json import JSONDecodeError


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
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])


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
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            email = req_data['email']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        try:
            User.objects.create_user(username, email, password=password)
        except (Exception) as e:
            return HttpResponseBadRequest()
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])


def signin(request):
    """
    Log in to the provided account.
    
    In **POST**: Log in to the account
    
    POST parameters:
        POST['username']: Unique username
        POST['password']: Password

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response 
    :rtype: HttpResponse

    """
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            username = req_data['username']
            password = req_data['password']
        except (KeyError, JSONDecodeError) as e:
            return HttpResponseBadRequest()
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['POST'])


def signout(request):
    """
    Log out from the current account.
    
    In **GET**: Log out from the account

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response 
    :rtype: HttpResponse

    """
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])
