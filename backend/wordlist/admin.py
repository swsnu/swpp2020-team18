"""
Register wordlist models to admin site
"""
from django.contrib import admin

# Register your models here.
from .models import Word, Phrase, Wordlist

admin.site.register(Word)
admin.site.register(Phrase)
admin.site.register(Wordlist)
