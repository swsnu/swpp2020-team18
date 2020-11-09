# from celery import task
from celery import shared_task
from celery.utils.log import get_task_logger

from article import models as article_model
from terminator import sensitive

import requests
from bs4 import BeautifulSoup
# We can have either registered task 
# @task(name='summary') 
# def send_import_summary():
# 	logger.info('Whoowho I\'m')
    # Magic happens here ... 
# or 
@shared_task 
def send_notifiction():
  test = article_model.Article();
  test.title = "Hey";
  test.content = "Hello, Celery";
  test.save()
  print('Here I\'m')
    # Another trick

@shared_task
def fetch_article():
  try:
    url = r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s" % sensitive.NYTIMES_API_KEY
    response = requests.get(url)
    data = response.json()
    # print(data)

    num = data['num_results']
    results = data['results']

    for result in results:
      print(result['url'])
      response = requests.get(result['url'])
      author = result['byline']
      soup = BeautifulSoup(response.text, 'html.parser')
      article = soup.select('article')[0]
      abstract = article[0].select('.css-8hvvyd')[0]
      print(abstract)


  except Exception as e:
    print("Something went wrong while fetching article:", e)

@shared_task
def add(a, b):
  return a+b