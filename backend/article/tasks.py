"""
Asynchronous tasks for fetching articles using celery
"""

# from celery import task
from celery import shared_task
from celery.utils.log import get_task_logger
from article.models import Article
from terminator import sensitive
import requests
from bs4 import BeautifulSoup
import logging
from gensim.summarization import keywords
from nltk.stem import WordNetLemmatizer
from wordlist.models import Phrase, Word
import nltk

logger = logging.getLogger(__name__)

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

    logger.debug('Fetching articles from NYTimes...')
    for result in results:
      response = requests.get(result['url'])
      original_url = result['url']
      title = result['title']
      author = result['byline']
      if author.startswith('By '):
        author = author[3:]
      soup = BeautifulSoup(response.text, 'html.parser')
      category = result['section']
      subcategory = result['subsection']

      logger.debug('Fetching from: %s' % original_url)
      logger.debug('Title: %s' % title)
      logger.debug('Author: %s' % author)

      article = soup.select('article')[0]
      section = article.select('section')[-1]
      text = section.text
      logger.debug('Content: %s' % text)

      phrases, keywords = extract_phrases_and_keywords(text, 10)

      article_model = Article(title=title, author=author, content=text)
      article_model.save()

      for (phrase, keyword) in zip(phrases, keywords):
        # TODO: Change korean meaning to real korean meaning
        word_model = Word(content=keyword, korean_meaning="가짜뜻", difficulty=5)
        word_model.save()
        phrase_model = Phrase(content=phrase, word=word_model)
        phrase_model.save()
        article_model.phrases.add(phrase_model.id)

    logger.debug('Fetching Completed!')

  except Exception as e:
    print("Something went wrong: ", repr(e))


def extract_phrases_and_keywords(content, number):
  """
    Return list of extracted phrases and keywords from content
    :param content: content from which phrases and keywords are extracted
    :type content: str
    :param number: number of phrases and keywords returned
    :type number: int
    :returns: (a list of phrases, a list of keywords)
    :rtype: tuple
  """
  keywords, l_keywords = extract_keywords(content, number, get_both=True)
  sentences = nltk.tokenize.sent_tokenize(content)
  output_phrases_list = []
  output_keywords_list = []

  for (l_keyword, keyword) in zip(l_keywords, keywords):
    for i in range(len(sentences)):
      sentence = sentences[i]
      if l_keyword in sentence:
        if not (sentence in output_phrases_list):
          output_phrases_list.append(sentence)
          output_keywords_list.append(keyword)
          continue

  logger.debug('Extracted phrases: ', output_phrases_list)
  return (output_phrases_list, output_keywords_list)


def extract_keywords(content, number, lemmatize=True, get_both=False):
  """
    Return list of extracted keywords from content
    :param content: content from which keywords are extracted
    :type content: str
    :param number: number of keywords returned
    :type number: int
    :param lemmatize: get lemmatized keywords
    :type lemmatize: boolean
    :param get_both: get both lemmatized and not lemmatized keywords
    :type get_both: boolean
    :returns: a list of keywords
    :rtype: list
  """
  lemmatizer = WordNetLemmatizer()
  pre_keywords = keywords(content).split('\n')

  temp_keywords = []
  count = 0

  for keyword in pre_keywords:
    if keyword.find(' ') == -1:
      temp_keywords.append(keyword)
      count += 1
    if count == number:
      break

  if not lemmatize:
    return temp_keywords

  processed_keywords = list(map(
    lambda kw: lemmatizer.lemmatize(kw, 'v'), temp_keywords
  ))

  logger.debug('Extracted keywords: ', processed_keywords)\

  if get_both:
    return [processed_keywords, temp_keywords]

  return processed_keywords
