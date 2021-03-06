"""
Configuration of Celery
"""

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "terminator.settings")
app = Celery("terminator", broker=r"amqp://localhost")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    """
    Print request for debug purpose
    """
    print(f"Request: {self.request!r}")
