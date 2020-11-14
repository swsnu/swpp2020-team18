"""
URL Configuration of wordlist
"""
from django.urls import path

from . import views

urlpatterns = [
    path("", views.wordlist, name="wordlist"),
]
