"""
URL Configuration of accounts
"""
from django.urls import path
from accounts import views

urlpatterns = [
    path("signup", views.signup, name="signup"),
    path("signin", views.signin, name="signin"),
    path("signout", views.signout, name="signout"),
    path("scores", views.user_scores, name="user_scores"),
    path("ranking", views.user_ranking, name="user_ranking"),
]
