import numpy as np

from article.models import Article
from wordtest.models import History, HistoryWord
from wordlist.models import Word
from django.contrib.auth import get_user_model
User = get_user_model()

def makeMatrix():
    """
    Make matrix
    rows : each user
    column : each word
    """
    users = list(User.objects.all())
    words = list(Word.objects.all())
    
    matrix = np.empty((0, len(words)), dtype=np.float32)

    for user in users:
        user_word_confidence_row_list = [None]*len(words)
        for word in user.history.learned_word.all():
            idx = words.index(word)
            try:
                hw = HistoryWord.objects.filter(history=user.history, word=word)[0]
                confidence = hw.confidence
            except:
                confidnece = None
            user_word_confidence_row_list[idx] = confidence
        print(user_word_confidence_row_list)
        matrix = np.append(matrix, np.array([user_word_confidence_row_list]), axis=0)
    print(matrix)
        
    return matrix

def fillMatrix(matrix):
    """
    Fill out matrix
    with collaborative filtering method
    """
