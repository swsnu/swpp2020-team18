# from celery import task
from celery import shared_task
from celery.utils.log import get_task_logger

from article.models import Article
from terminator import sensitive

import requests
from bs4 import BeautifulSoup

@shared_task
def fetch_article_nytimes():
  """
    Fetch today's most popular news and
    Save it as **Article** model.
    This task can be scheduled via either 
    Django admin console or settings.py

  """
  try:
    url = r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s" % sensitive.NYTIMES_API_KEY
    response = requests.get(url)
    data = response.json()

    num = data['num_results']
    results = data['results']

    for result in results:
      response = requests.get(result['url'])
      title = result['title']
      author = result['byline']
      soup = BeautifulSoup(response.text, 'html.parser')
      category = result['section']
      subcategory = result['subsection']

      article = soup.select('article')[0]
      section = article[0].select('section')[0]
      text = section.text
      original_url = result['url']

      article_model = Article(title=title, author=author, content=text)
      article_model.save()
      
  except Exception as e:
    print("Something went wrong: ", e)

