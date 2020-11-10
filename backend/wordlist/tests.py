from django.test import TestCase, Client
import json
from .models import Phrase, Wordlist, WordlistPhrase, Word
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()

class WordlistTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user('testuser1@test.com', 'TEST_USER_1', password='TEST_PASSWORD_1')
        word = Word(content="example", korean_meaning="예시", difficulty=1)
        word.save()
        phrase = Phrase(content="example sentence", word=word)
        phrase.save()
        phrase_to_add = Phrase(content="example sentence to add", word=word)
        phrase_to_add.save()
        user.wordlist.added_phrase.add(phrase)

    # model test
    def test_phrase_print(self):
        phrase = Phrase.objects.first()
        self.assertEqual(str(phrase), f'문장: {str(phrase.content)}, 단어: {str(phrase.word.content)}')

    def test_wordlist_print(self):
        wordlist = Wordlist.objects.first()
        self.assertEqual(str(wordlist), f'단어장 소유: {str(wordlist.user.username)}')

    def test_word_print(self):
        word = Word.objects.first()
        self.assertEqual(str(word), str(word.content))

    # wordlist get
    def test_get_wordlist(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.get('/api/wordlist/')
        self.assertIn("example sentence", response.content.decode())
        self.assertIn("example", response.content.decode())
        self.assertIn("예시", response.content.decode())

    def test_get_wordlist_not_logged_in(self):
        client = Client()
        response = client.get('/api/wordlist/')
        self.assertEqual(response.status_code, 401)

    def test_get_wordlist_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.post('/api/wordlist/', json.dumps({'phrase': 'phrase'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    # wordlist_add
    def test_wordlist_add(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence to add', 'action': 'add'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_wordlist_add_non_existing_phrase(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence to add non', 'action': 'add'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_wordlist_add_not_logged_in(self):
        client = Client()
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence to add', 'action': 'add'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wordlist_add_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.put('/api/wordlist/', json.dumps({'phrase': 'example sentence to add', 'action': 'add'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    # wordlist_remove
    def test_wordlist_remove(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence', 'action': 'remove'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_wordlist_remove_non_existing_phrase(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence non', 'action': 'remove'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_wordlist_remove_not_logged_in(self):
        client = Client()
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence', 'action': 'remove'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wordlist_remove_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.put('/api/wordlist/', json.dumps({'phrase': 'example sentence', 'action': 'remove'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    # parameter action not add nor remove
    def test_wordlist_parameter_action_wrong(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/api/wordlist/', json.dumps({'phrase': 'example sentence', 'action': 'wrong'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)