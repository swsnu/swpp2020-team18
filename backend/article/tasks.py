"""
Asynchronous tasks for fetching articles using celery
"""

import logging
from celery import shared_task
import requests
from bs4 import BeautifulSoup
from gensim.summarization import keywords
import nltk
from nltk.stem import WordNetLemmatizer
from django.db import IntegrityError
from article.models import Article
from terminator import sensitive
from wordlist.models import Phrase, Word
import random

logger = logging.getLogger(__name__)

fake_words = [
    "참다",
    "크기",
    "독립",
    "대기",
    "화분",
    "망원경",
    "서랍",
    "엉터리",
    "전문직",
    "제출",
]

@shared_task
def fetch_article_nytimes():  # pylint: disable=too-many-locals
    """
    Fetch today's most popular news and
    # Save it as **Article** model.
    This task can be scheduled via either
    Django admin console or settings.py
    """
    try:
        url = (
            r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s"
            % sensitive.NYTIMES_API_KEY
        )
        response = requests.get(url)
        data = response.json()

        # num = data["num_results"]
        results = data["results"]

        logger.debug("Fetching articles from NYTimes...")
        for result in results:
            response = requests.get(result["url"])
            original_url = result["url"]
            title = result["title"]
            author = result["byline"]
            if author.startswith("By "):
                author = author[3:]
            soup = BeautifulSoup(response.text, "html.parser")
            # category = result["section"]
            # subcategory = result["subsection"]

            logger.debug("Fetching from: %s", original_url)
            logger.debug("Title: %s", title)
            logger.debug("Author: %s", author)

            article = soup.select("article")[0]
            section = article.select("section")[-1]
            text = section.text
            logger.debug("Content: %s", text)

            phrases, keywords_list = extract_phrases_and_keywords(text, 7)

            article_model = Article(title=title, author=author, content=text)
            article_model.save()

            korean_meanings_list = []

            for word in Word.objects.all():
                korean_meanings_list.append(word.korean_meaning)

            for (phrase, keyword) in zip(phrases, keywords_list):
                try:
                    copied_korean_meanings_list = korean_meanings_list.copy()
                    korean_meaning = search_daum_endic(keyword)
                    if len(Word.objects.filter(content=keyword)) == 0:
                        word_model = Word(
                        content=keyword, korean_meaning=korean_meaning, difficulty=5
                        )
                        word_model.save()
                        copied_korean_meanings_list.append(korean_meaning)
                    elif len(Word.objects.filter(content=keyword)) == 1:
                        word_model = Word.objects.get(content=keyword)
                    else:
                        word_model = Word.objects.filter(content=keyword).first()
                    copied_korean_meanings_list = list(set(copied_korean_meanings_list))
                    copied_korean_meanings_list.remove(korean_meaning)
                    random.shuffle(copied_korean_meanings_list)
                    if len(copied_korean_meanings_list) >= 3:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        phrase_model.option_two = copied_korean_meanings_list.pop()
                        phrase_model.option_three = copied_korean_meanings_list.pop()
                    elif len(copied_korean_meanings_list) == 2:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        phrase_model.option_two = copied_korean_meanings_list.pop()
                        phrase_model.option_three = random.sample(fake_words, 1)[0]
                    elif len(copied_korean_meanings_list) == 1:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        using_fake_words = random.sample(fake_words, 2)
                        phrase_model.option_two = using_fake_words[0]
                        phrase_model.option_three = using_fake_words[1]
                    else:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        using_fake_words = random.sample(fake_words, 3)
                        phrase_model.option_one = using_fake_words[0]
                        phrase_model.option_two = using_fake_words[1]
                        phrase_model.option_three = using_fake_words[2]
                    phrase_model.save()


                    article_model.phrases.add(phrase_model.id)
                except IntegrityError:
                    logger.debug("Duplicate data")

        logger.debug("Fetching Completed!")

    except (requests.exceptions.RequestException, KeyError, IndexError) as exceptions:
        logger.debug("Something went wrong: %s", repr(exceptions))



@shared_task
def fetch_article_nytimes_archive(year, month, num=-1):  # pylint: disable=too-many-locals
    """
    Fetch news from archive and
    # Save it as **Article** model.
    """
    try:
        url = (
            r"https://api.nytimes.com/svc/archive/v1/%d/%d.json?api-key=%s"
            % (year, month, sensitive.NYTIMES_API_KEY)
        )
        response = requests.get(url)
        data = response.json()

        results = data["response"]["docs"]
        if(num==-1):
            num = len(data["response"]["docs"])

        logger.debug("Fetching articles from NYTimes...")
        for result in results[:num]:
            response = requests.get(result["web_url"])
            original_url = result["web_url"]
            title = result["headline"]["main"]
            author = result["byline"]["original"]
            if author.startswith("By "):
                author = author[3:]
            soup = BeautifulSoup(response.text, "html.parser")
            # category = result["section"]
            # subcategory = result["subsection"]

            logger.debug("Fetching from: %s", original_url)
            logger.debug("Title: %s", title)
            logger.debug("Author: %s", author)

            article = soup.select("article")[0]
            section = article.select("section")[-1]
            text = section.text
            logger.debug("Content: %s", text)

            phrases, keywords_list = extract_phrases_and_keywords(text, 7)

            article_model = Article(title=title, author=author, content=text)
            article_model.save()

            korean_meanings_list = []

            for word in Word.objects.all():
                korean_meanings_list.append(word.korean_meaning)

            for (phrase, keyword) in zip(phrases, keywords_list):
                try:
                    copied_korean_meanings_list = korean_meanings_list.copy()
                    korean_meaning = search_daum_endic(keyword)
                    if len(Word.objects.filter(content=keyword)) == 0:
                        word_model = Word(
                        content=keyword, korean_meaning=korean_meaning, difficulty=5
                        )
                        word_model.save()
                        copied_korean_meanings_list.append(korean_meaning)
                    elif len(Word.objects.filter(content=keyword)) == 1:
                        word_model = Word.objects.get(content=keyword)
                    else:
                        word_model = Word.objects.filter(content=keyword).first()
                    copied_korean_meanings_list = list(set(copied_korean_meanings_list))
                    copied_korean_meanings_list.remove(korean_meaning)
                    random.shuffle(copied_korean_meanings_list)
                    if len(copied_korean_meanings_list) >= 3:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        phrase_model.option_two = copied_korean_meanings_list.pop()
                        phrase_model.option_three = copied_korean_meanings_list.pop()
                    elif len(copied_korean_meanings_list) == 2:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        phrase_model.option_two = copied_korean_meanings_list.pop()
                        phrase_model.option_three = random.sample(fake_words, 1)[0]
                    elif len(copied_korean_meanings_list) == 1:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        phrase_model.option_one = copied_korean_meanings_list.pop()
                        using_fake_words = random.sample(fake_words, 2)
                        phrase_model.option_two = using_fake_words[0]
                        phrase_model.option_three = using_fake_words[1]
                    else:
                        phrase_model = Phrase(content=phrase, word=word_model)
                        using_fake_words = random.sample(fake_words, 3)
                        phrase_model.option_one = using_fake_words[0]
                        phrase_model.option_two = using_fake_words[1]
                        phrase_model.option_three = using_fake_words[2]
                    phrase_model.save()


                    article_model.phrases.add(phrase_model.id)
                except IntegrityError:
                    logger.debug("Duplicate data")

        logger.debug("Fetching Completed!")

    except (requests.exceptions.RequestException, KeyError, IndexError) as exceptions:
        logger.debug("Something went wrong: %s", repr(exceptions))



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
    lemmatized_keywords, raw_keywords = extract_keywords( # pylint: disable=unbalanced-tuple-unpacking
        content, number, get_both=True
    )  # pylint: disable=unbalanced-tuple-unpacking
    sentences = nltk.tokenize.sent_tokenize(content)
    output_phrases_list = []
    output_keywords_list = []

    for (raw_keyword, keyword) in zip( # pylint: disable=unused-variable
        raw_keywords, lemmatized_keywords
    ):
        for sentence in sentences:
            if raw_keyword in sentence.lower():
                if not sentence in output_phrases_list:
                    output_phrases_list.append(sentence)
                    output_keywords_list.append(raw_keyword)
                    break

    logger.debug("Extracted phrases: %s", output_phrases_list)
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
    pre_keywords = keywords(content).split("\n")[:number]

    temp_keywords = []
    count = 0

    for keyword in pre_keywords:
        if keyword.find(" ") == -1:
            temp_keywords.append(keyword)
            count += 1
        if count == number:
            break

    if not lemmatize:
        return temp_keywords

    processed_keywords = list(
        map(lambda kw: lemmatizer.lemmatize(kw, "v"), temp_keywords)
    )

    logger.debug("Extracted keywords: %s", processed_keywords)
    if get_both:
        return [processed_keywords, temp_keywords]

    return processed_keywords


def search_daum_endic(english_word):
    """
    Return korean meaning of the english word using daum dictionary
    (Original code from : https://gist.github.com/ultrakain/1ec00a17eebb1abfded81f91179aa9ff)
    :param english_word: english word
    :type english_word: str

    :returns: korean meaning of the word, if not found return english word
    :rtype: str
    """
    dic_url = "http://dic.daum.net/search.do?q={0}"
    response = requests.get(dic_url.format(english_word))
    soup = BeautifulSoup(response.text, "html.parser")
    result_means = soup.find_all(attrs={"class": "list_search"})
    try:
        return result_means[0].text.strip()
    except IndexError:
        return english_word
