from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from wordlist.models import Phrase, Wordlist, AddPhrase
from django.contrib.auth.models import User
import json

# Create your views here.
def wordlist(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            word_all_list = [{'word': phrase['phrase_keyword'], 'phrase': phrase['phrase_content']} for phrase in Wordlist.objects.get(user = request.user).added_phrase.all().values()]
            return JsonResponse(word_all_list, safe=False)
        else:
            return HttpResponse(status=401)
    # TODO
    # wordlist를 user당 1개로 제한하지 않는다면 post도 필요

    # if request.method == 'POST':
    #     if request.user.is_authenticated:
    #         wordlist = Wordlist(user=request.user)
    #         wordlist.save()
    #     else:
    #         return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

def wordlist_add(request):
    if request.method == 'PATCH':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            word_data = req_data['word']
            phrase_data = req_data['phrase']
            # TODO
            # phrase가 다 데이터베이스에 들어있다고 가정하면
            try:
                adding_phrase = Phrase.objects.get(phrase_content=phrase_data, phrase_keyword=word_data)
            except:
                return HttpResponse(status=404)
            # 새로 데이터를 받아 생성한다면 아래처럼
            # adding_phrase = Phrase(phrase_content=phrase_data, phrase_keyword=word_data)
            # adding_phrase.save()
            wordlist = request.user.wordlist
            wordlist.added_phrase.add(adding_phrase)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PATCH'])

def wordlist_remove(request):
    if request.method == 'PATCH':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            word_data = req_data['word']
            phrase_data = req_data['phrase']
            # TODO
            # phrase가 다 데이터베이스에 들어있다고 가정하면
            try:
                removing_phrase = Phrase.objects.get(phrase_content=phrase_data, phrase_keyword=word_data)
            except:
                return HttpResponse(status=404)
            wordlist = request.user.wordlist
            wordlist.added_phrase.remove(removing_phrase)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PATCH'])