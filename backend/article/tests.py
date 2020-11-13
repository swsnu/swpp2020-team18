"""
Test for article
"""
import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
import responses
from terminator import sensitive
from .models import Article
from article import tasks

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
        article_model = Article(title="TEST_ARTICLE_TITLE1", author="TEST_ARTICLE_AUTHOR1", content="TEST_ARTICLE_CONTENT1")
        article_model.save()


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
    def test_fetch_article_nytimes(self):
        """
        Test fetch_article_nytimes task
        """
        responses.add(responses.GET, r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s" % sensitive.NYTIMES_API_KEY,
                  json={'error': 'not found'}, status=404)
        responses.add(responses.GET, r"https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=%s" % sensitive.NYTIMES_API_KEY,
                  json={'num_results': 1, 'results': [{"url":"https://nytimes.com/mock", "title":"mock_title", "byline":"By mock_author"}]}, status=200)


        tasks.fetch_article_nytimes()

        responses.add(responses.GET, r"https://nytimes.com/mock", body="<article><section>hey</section></article>")
        responses.add(responses.GET, r"http://dic.daum.net/search.do?q=hey",
               body="<div class='list_search'>어이</div>")

        tasks.fetch_article_nytimes()

        responses.add(responses.GET, r"https://nytimes.com/mock", body="<article><section>hey</section></article>")
        responses.add(responses.GET, r"http://dic.daum.net/search.do?q=hey",
               body="fake response")

        tasks.fetch_article_nytimes()


    def test_article_one(self):
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")

        response = client.get("/api/article/1")
        self.assertEqual(response.status_code, 200)
