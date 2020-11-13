"""
Views of article
"""

import random
# import json
from json import JSONDecodeError
from django.contrib.auth.decorators import login_required
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    HttpResponseBadRequest,
    JsonResponse,
)
from .models import Article


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


@login_required
def article_one(request, article_id):
    """
    Return requested article in JSON format.

    In **GET**: Log in to the account

    :param request: a HTTP request
    :type request: HttpRequest
    :param article_id: requested article's id
    :type article_id: int

    :returns: a JSON response
    :rtype: JsonResponse

    """
    if request.method == "GET":
        try:
            article = Article.objects.get(pk=article_id)
            title = article.title
            author = article.author
            content = article.content
            phrases = list(
                map(
                    lambda phrase: {
                        "content": phrase.content,
                        "keyword": phrase.word.content,
                    },
                    article.phrases.all(),
                )
            )
            return JsonResponse(
                {
                    "title": title,
                    "author": author,
                    "content": content,
                    "phrases": phrases,
                },
                safe=False,
                status=200,
            )

        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(["GET"])


@login_required
def article_quiz(request, article_id):
    """
    Perform article test related operation.

    In **GET**: Get question words
    In **POST**: Post answers

    :param request: a HTTP request
    :type request: HttpRequest
    :param article_id: requested article's id
    :type article_id: int

    :returns: a JSON response
    :rtype: JsonResponse

    """

    if request.method == "GET":
        try:
            article = Article.objects.get(pk=article_id)

            def mixup(korean_meaning):
                choice = random.sample(fake_words, 3) + [korean_meaning]
                random.shuffle(choice)
                return choice

            phrases = list(
                map(
                    lambda phrase: {
                        "content": phrase.content,
                        "keyword": phrase.word.content,
                        "choices": mixup(phrase.word.korean_meaning),
                    },
                    article.phrases.all(),
                )
            )
            return JsonResponse({"phrases": phrases}, safe=False, status=200)

        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
    elif request.method == "POST":
        # TODO: Scoring # pylint: disable=fixme
        return HttpResponse()
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


# TODO: Make more sophiscated way # pylint: disable=fixme
@login_required
def article_recommend(request):
    """
    Get article recommendation

    In **GET**: Get article recommendation

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a JSON response
    :rtype: JsonResponse

    """

    if request.method == "GET":
        try:
            count = Article.objects.all.count()
            article_id = random.randint(1, count + 1)

            return JsonResponse({"recommendation": [article_id]}, safe=False, status=200)

        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(["GET"])
