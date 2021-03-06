"""
Test for article
"""
# import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
import responses
from terminator import sensitive
from article import tasks
from wordlist.models import Phrase, Word
from .models import Article
import nltk
from nltk.stem import WordNetLemmatizer
from wordtest.models import History, HistoryWord
import json


User = get_user_model()


class ArticleTestCase(TestCase):
    """
    A class to test article.
    It extends :class:`django.test.TestCase` class.
    """

    def setUp(self):
        """
        Article Test Settings

        """
        User.objects.create_user(
            "testuser1@test.com", "TEST_USER_1", password="TEST_PASSWORD_1"
        )
        article_model = Article(
            title="TEST_ARTICLE_TITLE1",
            author="TEST_ARTICLE_AUTHOR1",
            content="TEST_ARTICLE_CONTENT1",
        )
        article_model.save()
        word_model = Word(content="FAKE_WORD", korean_meaning="가짜뜻", difficulty=3)
        word_model.save()
        phrase_model = Phrase(
            content="FAKE_PHRASE CONTAINING FAKE_WORD", word=word_model
        )
        phrase_model.save()
        article_model.phrases.add(phrase_model.id)
        history_model = History.objects.first()
        history_model.learned_word.add(word_model)

    def test_model(self):
        """
        Test article models

        """
        title = "TEST_ARTICLE_TITLE2"
        author = "TEST_ARTICLE_AUTHOR2"
        content = "TEST_ARTICLE_CONTENT2"
        article_model = Article(title=title, author=author, content=content)
        article_model.save()
        self.assertEqual(str(article_model), title)

    @responses.activate
    def test_fetch_article_nytimes(self): # pylint: disable=no-self-use
        """
        Test fetch_article_nytimes task
        """
        responses.add(
            responses.GET,
            r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s"
            % sensitive.NYTIMES_API_KEY,
            json={"error": "not found"},
            status=404,
        )
        responses.add(
            responses.GET,
            r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s"
            % sensitive.NYTIMES_API_KEY,
            json={
                "num_results": 1,
                "results": [
                    {
                        "url": "https://nytimes.com/mock",
                        "title": "mock_title",
                        "byline": "By mock_author",
                    }
                ],
            },
            status=200,
        )

        tasks.fetch_article_nytimes()

        responses.add(
            responses.GET,
            r"https://nytimes.com/mock",
            body="<article><section>hey</section></article>",
        )
        responses.add(
            responses.GET,
            r"http://dic.daum.net/search.do?q=hey",
            body="<div class='list_search'>어이</div>",
        )

        tasks.fetch_article_nytimes()

        responses.add(
            responses.GET,
            r"https://nytimes.com/mock",
            body="<article><section>hey</section></article>",
        )
        responses.add(
            responses.GET, r"http://dic.daum.net/search.do?q=hey", body="fake response"
        )

        tasks.fetch_article_nytimes()

    def test_article_one(self):
        """
        Test article_one
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")

        response = client.get("/api/articles/1")
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/articles/1")
        self.assertEqual(response.status_code, 405)

    def test_article_quiz(self):
        """
        Test article_quiz
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")

        response = client.get("/api/articles/1/quiz")
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/articles/1/quiz", json.dumps({"answers": ["예시"]}), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        response = client.put("/api/articles/1/quiz")
        self.assertEqual(response.status_code, 405)

    # def test_article_recommend(self):
    #     client = Client()
    #     client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")

    #     response = client.get("/api/articles/recommend")
    #     self.assertEqual(response.status_code, 200)
    #     response = client.post("/api/articles/recommend")
    #     self.assertEqual(response.status_code, 405)
