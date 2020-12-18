from django.urls import path

from . import views

urlpatterns = [
    # TODO
    # need to divide first login user and others?
    path("", views.history, name="history"),
    path("review/", views.review_test, name="review_test"),
    path("level/", views.level_test, name="level_test"),
]
