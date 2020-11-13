"""
Settings of backend server of Term'inator
"""
from .celery import app as celery_app

__all__ = ("celery_app",)
