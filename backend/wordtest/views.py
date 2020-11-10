from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()
from wordtest.models import Question
from wordlist.models import Word, Phrase, Wordlist, WordlistPhrase
import json
import random

def get_random_choice():
    """
    Get random korean meaning in Word model as test choices

    :returns: string of random meaning
    :rtype: string
    """
    max_id = Word.objects.all().aggregate(max_id=Max("id"))['max_id']
    while True:
        pk = random.randint(1, max_id)
        choice = Word.objects.filter(pk=pk).first().korean_meaning
        if choice:
            return choice

def wordtest(request):
    """
    Get a number of phrase from user's word list to make test
    need to select proper number of phrases.
    In **GET**: Get a number of phrases and choices
    In **POST**: Post answer and test result
    
    :param request: a HTTP request
    :type request: HttpRequest

    :returns: a JSON response with questions
    :rtype: JsonResponse
    """
    if request.method == 'GET':
        if request.user.is_authenticated:
            taker = User.objects.get(user=request.user)
            taker_wordlist = WordlistPhrase.objects.filter(user=taker)
            question_number = 1
            question_list = []

            if taker_wordlist.count() < 20:
                for phrase in taker_wordlist.all().values():
                    question = {
                        'number': question_number,
                        'phrase': phrase['phrase_content'],
                        'word': phrase['phrase_word'],
                        'correct': phrase['korean_meaning'],
                        'wrong1': get_random_choice(),
                        'wrong2': get_random_choice(),
                        'wrong3': get_random_choice()
                    }
                    question_list.append(question)
                    question_number += 1
            else:
                for confidence in range (1, 5):
                    for phrase in taker_wordlist.filter(confidence=confidence).all().values():
                        if question_list.count() >= 20:
                            break
                        question = {
                            'number': question_number,
                            'phrase': phrase['phrase_content'],
                            'word': phrase['phrase_word'],
                            'correct': phrase['korean_meaning'],
                            'wrong1': get_random_choice(),
                            'wrong2': get_random_choice(),
                            'wrong3': get_random_choice()
                        }
                        question_list.append(question)
                        question_number += 1
                
            return JsonResponse(question_list, safe=False)
        else:
            return HttpResponse(status=401)

    elif request.method == 'POST':
        # TODO
        return JsonResponse()
    
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])