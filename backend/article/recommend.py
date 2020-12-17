import numpy as np

from article.models import Article
from wordtest.models import History, HistoryWord
from wordlist.models import Word
from django.contrib.auth import get_user_model
User = get_user_model()
import warnings

warnings.filterwarnings("ignore", message="Mean of empty slice")

DEFAULT_VALUE = 1.5

users = []
words = []
articles = []


confidence_matrix = None
article_frequency_matrix = None
readabilty_matrix = None

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
    v1 = np.nan_to_num(v1, nan=DEFAULT_VALUE)
    v2 = np.nan_to_num(v2, nan=DEFAULT_VALUE)

    cos_sim = np.dot(v1, v2)/( np.linalg.norm(v1) * np.linalg.norm(v2) + 0.000001 )

    return cos_sim


def fillMatrix(matrix):
    """
    Fill out matrix
    with collaborative filtering method
    """
    global confidence_matrix
    filled_matrix = np.zeros((len(users), len(words)), dtype=np.float32)
    similarity_matrix = np.zeros((len(users), len(users)), dtype=np.float32)
    
    TOP_N = 3

    # Calculate similarity matrix
    for i in range(len(users)):
        for j in range(i+1):
            ccs = centeredCosineSimilarity(matrix[i], matrix[j])
            similarity_matrix[i][j] = ccs
            similarity_matrix[j][i] = ccs
            # print((i,j, matrix[i], matrix[j]))
    # print(similarity_matrix)

    for user_idx, user in enumerate(users):
        user_word_confidence_row_list = [np.nan]*len(words)
        for word_idx, word in enumerate(words):
            if not np.isnan(matrix[user_idx][word_idx]):
                expected_confidence = matrix[user_idx][word_idx]
            else:
                has_word_confidence_idx_list = []
                confidence_list = []
                for i in range(len(users)):
                    if not np.isnan(matrix[i][word_idx]):
                        has_word_confidence_idx_list.append(i)
                        confidence_list.append(matrix[i][word_idx])
                similarity_list = list(map(lambda idx: similarity_matrix[user_idx][idx], has_word_confidence_idx_list))
                
                if len(has_word_confidence_idx_list) == 0:
                    expected_confidence = DEFAULT_VALUE
                else:
                    zipped = list(zip(similarity_list, confidence_list, has_word_confidence_idx_list))
                    zipped.sort()
                    zipped = zipped[:TOP_N]
                    sum_similarity = 0
                    sum_weight = 0
                    for sim, conf, i in zipped:
                       sum_weight += conf * sim
                       sum_similarity += sim
                    expected_confidence = sum_weight / sum_similarity
                    if (np.isnan(expected_confidence)):
                        expected_confidence = DEFAULT_VALUE

            filled_matrix[user_idx][word_idx] = expected_confidence
    
    confidence_matrix = filled_matrix
    return filled_matrix
 

def makeFrequencyMatrix():
    global articles
    global users
    global words
    global article_frequency_matrix # num_article * num_word

    matrix = fillMatrix(makeMatrix())

    if len(articles) != Article.objects.all().count():
        articles = list(Article.objects.all())
        article_frequency_matrix = np.empty((0, len(words)), dtype=np.float32)
        for article in articles:
            article_frequency_row_vector = [0.0]*len(words)
            num_word_in_article = article.phrases.all().count()
            for phrase in article.phrases.all():
                article_frequency_row_vector[words.index(phrase.word)] += 1/num_word_in_article
            article_frequency_matrix = np.append(article_frequency_matrix, np.array([article_frequency_row_vector]), axis=0)
    
    return article_frequency_matrix


def calculateReadabilityMatrix():
    global article_frequency_matrix
    global readabilty_matrix

    global confidence_matrix

    makeFrequencyMatrix()

    readabilty_matrix = np.matmul(confidence_matrix/10.0, article_frequency_matrix.transpose())


    return readabilty_matrix


