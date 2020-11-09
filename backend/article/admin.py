"""
Register article models to admin site
"""

from django.contrib import admin
from .models import Article

admin.site.register(Article)
