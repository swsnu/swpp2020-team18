from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    published_date = models.DateTimeField(
            blank=True, null=True)
