from django.urls import path

from . import views

urlpatterns = [
    # TODO
    # need to divide first login user and others?
    path("", views.wordtest, name="wordtest"),
]
