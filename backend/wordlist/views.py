from django.shortcuts import render

# Create your views here.
def wordlist(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            word_all_list = [{'word': phrase['phrase_keyword'], 'phrase': phrase['phrase_content']} for phrase in Wordlist.objects.get(learner = request.user).added_phrase.all().values()]
            return JsonResponse(word_all_list, safe=False)
        else:
            return HttpResponse(status=401)
    if request.method == 'POST':
        if request.user.is_authenticated:
            wordlist = Wordlist(learner=request.user)
            wordlist.save()
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])