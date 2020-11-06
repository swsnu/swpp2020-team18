from django.urls import path

from . import views

urlpatterns = [
    path('', views.wordlist, name='wordlist'),
    path('add', views.wordlist_add, name='wordlist_add'),
    path('remove', views.wordlist_remove, name='wordlist_remove'),
]
