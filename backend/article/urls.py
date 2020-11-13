"""
URL Configuration of article
"""
from django.urls import path
from article import views

urlpatterns = [
    path("<int:id>", views.article_one, name="article_one"),
    path("<int:id>/quiz", views.article_quiz, name="article_quiz"),
    path("recommend", views.article_recommend, name="article_recommend"),
]
