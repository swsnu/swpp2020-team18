import numpy as np

from article.models import Article
from wordtest.models import History, HistoryWord
from wordlist.models import Word
from django.contrib.auth import get_user_model
User = get_user_model()

users = []
words = []

def makeMatrix():
    """
    Make matrix
    rows : each user
    column : each word
    """
    global users
    global words
    if len(users) != User.objects.all().count():
        users = list(User.objects.all())
    if len(words) != Word.objects.all().count():
        words = list(Word.objects.all())
    
    matrix = np.empty((0, len(words)), dtype=np.float32)

    for user in users:
        user_word_confidence_row_list = [np.nan]*len(words)
        for word in user.history.learned_word.all():
            idx = words.index(word)
            try:
                hw = HistoryWord.objects.filter(history=user.history, word=word)[0]
                confidence = hw.confidence
            except:
                confidnece = np.nan
            user_word_confidence_row_list[idx] = confidence
        # print(user_word_confidence_row_list)
        matrix = np.append(matrix, np.array([user_word_confidence_row_list]), axis=0)
    # print(matrix)
        
    return matrix

def centeredCosineSimilarity(v1, v2):
    v1 = v1 - np.nanmean(v1)
    v2 = v2 - np.nanmean(v2)
    v1 = np.nan_to_num(v1)
    v2 = np.nan_to_num(v2)

    cos_sim = np.dot(v1, v2)/( np.linalg.norm(v1) * np.linalg.norm(v2) + 0.00001 )

    return cos_sim

def fillMatrix(matrix):
    """
    Fill out matrix
    with collaborative filtering method
    """
    