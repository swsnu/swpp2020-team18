from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()
from wordtest.models import *

def wordtest(request):
    # TODO

def submit(request):
    # TODO