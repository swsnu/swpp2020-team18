#!/bin/bash
celery -A terminator worker -l info 2>> worker.log &
celery -A terminator beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler &
