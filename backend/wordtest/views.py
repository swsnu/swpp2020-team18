from django.shortcuts import render
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

User = get_user_model()
from wordtest.models import History, HistoryWord
from wordlist.models import Word, Phrase, Wordlist, WordlistPhrase
import json
import random
from accounts.views import *

def history(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            req_data = json.loads(request.body.decode())
            words = req_data["words"]
            user_history = request.user.history
            for word_data in words:
                try:
                    found_word = Word.objects.get(content=word_data)
                except Word.DoesNotExist:
                    return HttpResponse(status=404)
                user_history.learned_word.add(found_word)
            return HttpResponse(status=201)
        elif request.method == "PATCH":
            req_data = json.loads(request.body.decode())
            words = req_data["words"]
            word_answers = req_data["answers"]
            test_type = req_data['type']
            user_history = request.user.history
            total = len(words)
            correct_answer_count = 0
            total_count = 0
            scored_words = []

            for word_data, answer_data in zip(words, word_answers):
                is_correct = False
                try:
                    found_word = Word.objects.get(content=word_data)
                except Word.DoesNotExist:
                    return HttpResponse(status=404)
                if len(user_history.learned_word.filter(content=word_data)) == 0:
                    return HttpResponse(status=404)
                try:
                    history_word = HistoryWord.objects.get(word=found_word, history=user_history)
                except HistoryWord.DoesNotExist:
                    return HttpResponse(status=404)

                if history_word.confidence != 1:
                    test_type == "review"

                if test_type == "new":
                    if found_word.korean_meaning == answer_data:
                        history_word.confidence = 5
                        correct_answer_count += 1
                        is_correct = True
                    else:
                        history_word.confidence = 1
                elif test_type == "review":
                    if found_word.korean_meaning == answer_data:
                        correct_answer_count += 1
                        if history_word.confidence < 10:
                            history_word.confidence += 1
                        is_correct = True
                    else:
                        history_word.confidence += 0
                else:
                    return HttpResponse(status=404)
                history_word.save()
                total_count += 1
                scored_words.append({
                    "content": word_data,
                    "answer": answer_data,
                    "correct_answer": found_word.korean_meaning,
                    "is_correct": is_correct,
                })
            addScore(request.user, 10*correct_answer_count)
            return JsonResponse({"scored_words": scored_words, "correct_answer_count": correct_answer_count, "total_count": total_count}, safe=False, status=200)
        else:
            return HttpResponseNotAllowed(["POST", "PATCH"])
    else:
        return HttpResponse(status=401)

def review_test(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            word_all_list = [
                {
                    "word": Word.objects.get(id=phrase["word_id"]).content,
                    "phrase": phrase["content"],
                    "options": random.sample([Word.objects.get(id=phrase["word_id"]).korean_meaning]+[phrase['option_one']]+[phrase['option_two']]+[phrase['option_three']], 4),
                    "confidence": HistoryWord.objects.get(
                        word=Word.objects.get(id=phrase["word_id"]),
                        history=request.user.history,
                    ).confidence,
                }
                for phrase in Wordlist.objects.get(user=request.user)
                .added_phrase.all()
                .values()
            ]
            sorted_word_all_list = sorted(word_all_list, key=lambda data: data["confidence"])
            if len(sorted_word_all_list) <= 20:
                test_data_list = sorted_word_all_list
            else:
                test_data_list = sorted_word_all_list[:20]

            return JsonResponse(
                test_data_list, safe=False, json_dumps_params={"ensure_ascii": False}
            )
        else:
            return HttpResponseNotAllowed(["GET"])
    else:
        return HttpResponse(status=401)

def level_test(request):
    if request.user.is_authenticated:
        if request.method == "GET":
            test_source = random.sample(list(Phrase.objects.all()), 10)
            user_history = request.user.history
            for phrase in test_source:
                user_history.learned_word.add(phrase.word)
            test_data_list = [
                {
                    "word": phrase.word.content,
                    "phrase": phrase.content,
                    "options": random.sample([phrase.word.korean_meaning]+[phrase.option_one]+[phrase.option_two]+[phrase.option_three], 4),
                }
                for phrase in test_source
            ]
            return JsonResponse(
                test_data_list, safe=False, json_dumps_params={"ensure_ascii": False}
            )
        else:
            return HttpResponseNotAllowed(["GET"])
    else:
        return HttpResponse(status=401)

# TODO
# 찬석님 코드 활용 방법 강구할 것
# below are codes from chanseck