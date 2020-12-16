"""
Register accounts models to admin site
"""

from django.contrib import admin
from .models import User, DailyRecord

admin.site.register(User)
admin.site.register(DailyRecord)
