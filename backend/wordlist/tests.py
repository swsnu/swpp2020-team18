from django.test import TestCase, Client
import json
# from django.contrib.auth.models import User
# from accounts.models import User
from .models import Phrase, Wordlist, AddPhrase
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()

class WordlistTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user('testuser1@test.com', 'TEST_USER_1', password='TEST_PASSWORD_1')
        phrase = Phrase(phrase_content="example sentence", phrase_keyword="example")
        phrase.save()
        phrase_to_add = Phrase(phrase_content="sentence to add", phrase_keyword="add")
        phrase_to_add.save()
        user.wordlist.added_phrase.add(phrase)
    
    # model test
    def test_phrase_print(self):
        phrase = Phrase.objects.first()
        self.assertEqual(str(phrase), phrase.phrase_keyword)

    def test_wordlist_print(self):
        wordlist = Wordlist.objects.first()
        self.assertEqual(str(wordlist), f'단어장 소유: {str(wordlist.user.username)}')

    # wordlist get
    def test_get_wordlist(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.get('/wordlist/')
        self.assertIn("example sentence", response.content.decode())
        self.assertIn("example", response.content.decode())

    def test_get_wordlist_not_logged_in(self):
        client = Client()
        response = client.get('/wordlist/')
        self.assertEqual(response.status_code, 401)

    def test_get_wordlist_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.post('/wordlist/', json.dumps({'word': 'word', 'phrase': 'phrase'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    # wordlist_add
    def test_wordlist_add(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/wordlist/add', json.dumps({'word': 'add', 'phrase': 'sentence to add'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_wordlist_add_non_existing_phrase(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/wordlist/add', json.dumps({'word': 'add_non', 'phrase': 'sentence to add non'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_wordlist_add_not_logged_in(self):
        client = Client()
        response = client.patch('/wordlist/add', json.dumps({'word': 'add', 'phrase': 'sentence to add'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wordlist_add_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.put('/wordlist/add', json.dumps({'word': 'add', 'phrase': 'sentence to add'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    # wordlist_remove
    def test_wordlist_remove(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/wordlist/remove', json.dumps({'word': 'example', 'phrase': 'example sentence'}), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_wordlist_remove_non_existing_phrase(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.patch('/wordlist/remove', json.dumps({'word': 'remove non', 'phrase': 'example sentence non'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_wordlist_remove_not_logged_in(self):
        client = Client()
        response = client.patch('/wordlist/remove', json.dumps({'word': 'example', 'phrase': 'example sentence'}), content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_wordlist_remove_wrong_request(self):
        client = Client()
        client.login(email='testuser1@test.com', password='TEST_PASSWORD_1')
        response = client.put('/wordlist/remove', json.dumps({'word': 'example', 'phrase': 'example sentence'}), content_type='application/json')
        self.assertEqual(response.status_code, 405)
