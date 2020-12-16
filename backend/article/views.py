"""
Views of article
"""

import random

import json
from json import JSONDecodeError
from django.contrib.auth.decorators import login_required
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    # HttpResponseBadRequest,
    JsonResponse,
)
from .models import Article
from accounts.views import *

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
        article = Article.objects.get(pk=article_id)

        def mixup(phrase):
            choice = [phrase.word.korean_meaning] + [phrase.option_one] + [phrase.option_two] + [phrase.option_three]
            random.shuffle(choice)
            return choice

        phrases = list(
            map(
                lambda phrase: {
                    "content": phrase.content,
                    "keyword": phrase.word.content,
                    "choices": mixup(phrase),
                },
                article.phrases.all(),
            )
        )
        return JsonResponse({"phrases": phrases}, safe=False, status=200)

    elif request.method == "POST":
        try:
            req_data = json.loads(request.body.decode())
            answers = req_data["answers"]
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
        
        article = Article.objects.get(pk=article_id)
        phrases = list(
            map(
                lambda phrase: {
                    "content": phrase.content,
                    "keyword": phrase.word.content,
                    "correct_answer": phrase.word.korean_meaning
                },
                article.phrases.all(),
            )
        )

        correct_answer_count = 0
        total_count = 0
        scored_phrases = []

        for (phrase, answer) in zip(phrases, answers):
            isCorrect = False
            if(phrase["correct_answer"]==answer):
                isCorrect = True
                correct_answer_count += 1
            total_count += 1
            scored_phrases.append({
                "content": phrase["content"],
                "keyword": phrase["keyword"],
                "answer": answer,
                "correct_answer": phrase["correct_answer"],
                "is_correct": isCorrect,
            })
            
            addScore(request.user, 10*correct_answer_count)

        return JsonResponse({"scored_phrases": scored_phrases, "correct_answer_count": correct_answer_count, "total_count": total_count}, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(["GET", "POST"])


# TODO: Make more sophiscated way # pylint: disable=fixme
# @login_required
# def article_recommend(request):
#     """
#     Get article recommendation

#     In **GET**: Get article recommendation

#     :param request: a HTTP request
#     :type request: HttpRequest

#     :returns: a JSON response
#     :rtype: JsonResponse

#     """

#     if request.method == "GET":
#         count = Article.objects.all.count()
#         article_id = random.randint(1, count + 1)

#         return JsonResponse({"recommendation": [article_id]}, safe=False, status=200)

#     else:
#         return HttpResponseNotAllowed(["GET"])
