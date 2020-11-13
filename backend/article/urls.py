"""
URL Configuration of article
"""
from django.urls import path
from article import views

urlpatterns = [
    path("<int:id>", views.article, name="article"),
    path("<int:id>/quiz", views.articleQuiz, name="articleQuiz"),
    path("recommend", views.articleRecommend, name="articleRecommend"),
]
