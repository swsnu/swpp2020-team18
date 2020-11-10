"""
Views of accounts
"""
from django.contrib.auth.decorators import login_required
from .models import Article
import json
from json import JSONDecodeError
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse


@login_required
def article(request, id):
    """
    Return requested article in JSON format.

    In **GET**: Log in to the account

    :param request: a HTTP request
    :type request: HttpRequest
    :param id: requested article's id
    :type id: int

    :returns: a JSON response
    :rtype: JsonResponse

    """
    if request.method == 'GET':
        try:
            article = Article.objects.get(pk=id)
            title = article.title
            author = article.author
            content = article.content
            phrases = list(map(
                lambda phrase: {'content': phrase.content, 'keyword': phrase.word.content}, article.phrases.all()))
            return JsonResponse({
                'title': title,
                'author': author,
                'content': content,
                'phrases': phrases
            }
            , safe=False, status=200)
            
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['GET'])


@login_required
def articleQuiz(request, id):
    """
    Perform article test related operation.

    In **GET**: Get question words
    In **POST**: Post answers

    :param request: a HTTP request
    :type request: HttpRequest
    :param id: requested article's id
    :type id: int

    :returns: a JSON response
    :rtype: JsonResponse

    """

    if request.method == 'GET':
        try:
            article = Article.objects.get(pk=id)
            phrases = list(map(
                lambda phrase: {'content': phrase.content, 'keyword': phrase.word.content, 'choices': ["가짜뜻1", "가짜뜻2", "가짜뜻3", "가짜뜻4"]}, article.phrases.all()))
            return JsonResponse({
                'phrases': phrases
            }
            , safe=False, status=200)
            
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()
    elif request.method == 'POST':
        # TODO: Scoring
        return HttpResponse()
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])