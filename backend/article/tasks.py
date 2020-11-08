from celery import task
from celery import shared_task
from celery.utils.log import get_task_logger

from article import models as article_model
# We can have either registered task 
@task(name='summary') 
def send_import_summary():
	logger.info('Whoowho I\'m')
    # Magic happens here ... 
# or 
@shared_task 
def send_notifiction():
    print('Here I\'m')
    # Another trick