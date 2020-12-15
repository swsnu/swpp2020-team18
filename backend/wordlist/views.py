"""
Views of wordlist
"""
import json
from django.http import (
    HttpResponse,
    HttpResponseNotAllowed,
    JsonResponse,
)
from django.contrib.auth import get_user_model
from wordlist.models import Phrase, Wordlist, WordlistPhrase, Word
from wordtest.models import History, HistoryWord
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
    if request.user.is_authenticated:
        if request.method == "GET":
            word_all_list = [
                {
                    "word": Word.objects.get(id=phrase["word_id"]).content,
                    "phrase": phrase["content"],
                    "korean_meaning": Word.objects.get(
                        id=phrase["word_id"]
                    ).korean_meaning,
                    "confidence": HistoryWord.objects.get(
                        word=Word.objects.get(id=phrase["word_id"]),
                        history=request.user.history,
                    ).confidence,
                    "created_at": WordlistPhrase.objects.get(
                        phrase=Phrase.objects.get(content=phrase["content"]),
                        wordlist=Wordlist.objects.get(user=request.user),
                    ).created_at,
                }
                for phrase in Wordlist.objects.get(user=request.user)
                .added_phrase.all()
                .values()
            ]
            return JsonResponse(
                word_all_list, safe=False, json_dumps_params={"ensure_ascii": False}
            )
        elif request.method == "PATCH":
            req_data = json.loads(request.body.decode())
            phrase_data = req_data["phrase"]
            phrase_action = req_data["action"]
            try:
                found_phrase = Phrase.objects.get(content=phrase_data)
            except Phrase.DoesNotExist:
                return HttpResponse(status=404)
            user_wordlist = request.user.wordlist
            if phrase_action == "add":
                user_wordlist.added_phrase.add(found_phrase)
            elif phrase_action == "remove":
                user_wordlist.added_phrase.remove(found_phrase)
            else:
                return HttpResponse(status=404)
            return HttpResponse(status=200)
        else:
            return HttpResponseNotAllowed(["GET", "PATCH"])
    else:
        return HttpResponse(status=401)
