from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from wordlist.models import Phrase, Wordlist, WordlistPhrase, Word
import json
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()

# Create your views here.
def wordlist(request):

    """
    Get or adjust the Wordlist model.
    In **GET**: Returns all the words and phrases in the user's wordlist

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a JSON response with all words and phrases
    :rtype: JsonResponse

    In **PATCH**: Add or remove a phrase(word) to user's wordlist

    PATCH parameters:
        PATCH['phrase']: Phrase
        PATCH['action']: Add or remove

    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a HTTP response
    :rtype: HttpResponse
    """

    if request.method == 'GET':
        if request.user.is_authenticated:
            word_all_list = [{'word': Word.objects.get(id=phrase['word_id']).content, 'phrase': phrase['content'], 'korean_meaning': Word.objects.get(id=phrase['word_id']).korean_meaning} for phrase in Wordlist.objects.get(user = request.user).added_phrase.all().values()]
            return JsonResponse(word_all_list, safe=False, json_dumps_params={'ensure_ascii': False})
        else:
            return HttpResponse(status=401)
    elif request.method == 'PATCH':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            phrase_data = req_data['phrase']
            phrase_action = req_data['action']
            if phrase_action == 'add':
                try:
                    adding_phrase = Phrase.objects.get(content=phrase_data)
                except:
                    return HttpResponse(status=404)
                wordlist = request.user.wordlist
                wordlist.added_phrase.add(adding_phrase)
                return HttpResponse(status=200)
            elif phrase_action == 'remove':
                try:
                    removing_phrase = Phrase.objects.get(content=phrase_data)
                except:
                    return HttpResponse(status=404)
                wordlist = request.user.wordlist
                wordlist.added_phrase.remove(removing_phrase)
                return HttpResponse(status=200)
            else:
                return HttpResponse(status=404)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'PATCH'])