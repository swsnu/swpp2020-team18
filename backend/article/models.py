"""
Models of accounts
"""
from django.db import models
from wordlist.models import Phrase

class Article(models.Model):
  """
  A class to represent article.
  :param title: Title of the article
  :type title: `django.db.models.CharField`
  :param author: Author of the article
  :type author: `django.db.models.CharField`
  :param content: Content of the article
  :type content: `django.db.models.TextField`
  :param difficulty: Difficulty of the article
  :type difficulty: `django.db.models.IntegerField`
  :param phrases: Phrases of the article
  :type phrases: `django.db.models.ManyToManyField`
  :param registered_date: Registered date of the article
  :type registered_date: `django.db.models.DateTimeField`
  """
  title = models.CharField(max_length=200)
  author = models.CharField(max_length=200)
  content = models.TextField()
  difficulty = models.IntegerField(default=5)
  phrases = models.ManyToManyField(Phrase)

  registered_date = models.DateTimeField(
          blank=True, null=True, auto_now_add=True)

  def __str__(self):
    return self.title