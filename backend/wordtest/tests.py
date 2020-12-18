"""
Test for wordtest
"""
import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Phrase, Wordlist, Word
from wordtest.models import History, HistoryWord

User = get_user_model()

class WordtestTestCase(TestCase):
    """
    A class to test wordlist.
    It extends :class:`django.test.TestCase` class.
    """
    def setUp(self):
        """
        Wordlist Test Settings
        """
        user = User.objects.create_user(
            "testuser1@test.com", "TEST_USER_1", password="TEST_PASSWORD_1"
        )
        word = Word(content="example", korean_meaning="예시", difficulty=1)
        word.save()
        word1 = Word(content="example1", korean_meaning="예시1", difficulty=1)
        word1.save()
        word2 = Word(content="example2", korean_meaning="예시2", difficulty=1)
        word2.save()
        phrase = Phrase(content="example sentence", word=word)
        phrase.save()
        phrase1 = Phrase(content="example sentence1", word=word)
        phrase1.save()
        phrase2 = Phrase(content="example sentence2", word=word)
        phrase2.save()
        phrase3 = Phrase(content="example sentence3", word=word)
        phrase3.save()
        phrase4 = Phrase(content="example sentence4", word=word)
        phrase4.save()
        phrase5 = Phrase(content="example sentence5", word=word)
        phrase5.save()
        phrase6 = Phrase(content="example sentence6", word=word)
        phrase6.save()
        phrase7 = Phrase(content="example sentence7", word=word)
        phrase7.save()
        phrase8 = Phrase(content="example sentence8", word=word)
        phrase8.save()
        phrase9 = Phrase(content="example sentence9", word=word)
        phrase9.save()
        phrase_to_add = Phrase(content="example sentence to add", word=word)
        phrase_to_add.save()
        user.wordlist.added_phrase.add(phrase)
        history = History.objects.first()
        history.learned_word.add(word)
        history.learned_word.add(word2)
        hw = HistoryWord.objects.get(word=word2, history=history)
        hw.confidence = 5
        hw.save()

    def test_history_print(self):
        """
        Test history model
        """
        history = History.objects.first()
        self.assertEqual(
            str(history), f"{str(history.user.username)}의 학습 데이터"
        )

    def test_history_post(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.post(
            "/api/wordtest/",
            json.dumps({"words": ["example"]}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)

    def test_history_post_unknown_word(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.post(
            "/api/wordtest/",
            json.dumps({"words": ["틀린예시"]}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)
    
    def test_history_patch(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example"], "answers": ["예시"], "type": "new"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_history_patch_not_added_in_history(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example1"], "answers": ["예시1"], "type": "new"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

    def test_history_patch_not_added_in_history_new_to_article(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example2"], "answers": ["예시2"], "type": "new"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_history_patch_not_added_in_history_wrong_type_param(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example2"], "answers": ["예시2"], "type": "awsome"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

    def test_history_patch_wrong_answer(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example2"], "answers": ["하하하"], "type": "new"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_history_patch_wrong_answer_review(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example2"], "answers": ["하하하"], "type": "review"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)



    def test_history_patch_review(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example"], "answers": ["예시"], "type": "review"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)

    def test_history_patch_not_existing_word(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["없음"], "answers": ["없음"], "type": "new"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 404)

    def test_history_patch_wrong_method(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.put(
            "/api/wordtest/",
            json.dumps({"words": ["example"], "answers": ["예시"], "type": "review"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 405)

    def test_history_patch_not_logged_in(self):
        """
        Test get method of api/wordlist
        """
        client = Client()
        response = client.patch(
            "/api/wordtest/",
            json.dumps({"words": ["example"], "answers": ["예시"], "type": "review"}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)

    def test_review_test_get(self):
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.get("/api/wordtest/review/")
        self.assertEqual(response.status_code, 200)

    def test_review_test_get_wrong_request(self):
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.delete("/api/wordtest/review/")
        self.assertEqual(response.status_code, 405)

    def test_review_test_get_not_logged_in(self):
        client = Client()
        response = client.get("/api/wordtest/review/")
        self.assertEqual(response.status_code, 401)

    def test_level_test_get(self):
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.get("/api/wordtest/level/")
        self.assertEqual(response.status_code, 200)

    def test_level_test_get_wrong_request(self):
        client = Client()
        client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
        response = client.delete("/api/wordtest/level/")
        self.assertEqual(response.status_code, 405)

    def test_level_test_get_not_logged_in(self):
        client = Client()
        response = client.get("/api/wordtest/level/")
        self.assertEqual(response.status_code, 401)
        # self.assertIn("예시", response.content.decode())
    # def test_get_wordlist_not_logged_in(self):
    #     """
    #     Test get method of api/wordlist when not logged in
    #     """
    #     client = Client()
    #     response = client.get("/api/wordlist/")
    #     self.assertEqual(response.status_code, 401)

    # def test_get_wordlist_wrong_request(self):
    #     """
    #     Test get method of api/wordlist with wrong request method
    #     """
    #     client = Client()
    #     client.login(email="testuser1@test.com", password="TEST_PASSWORD_1")
    #     response = client.post(
    #         "/api/wordlist/",
    #         json.dumps({"phrase": "phrase"}),
    #         content_type="application/json",
    #     )
    #     self.assertEqual(response.status_code, 405)