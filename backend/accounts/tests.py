"""
Test for accounts
"""
import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

User = get_user_model()

class AccountsTestCase(TestCase):
    """
    A class to test accounts.
    It extends :class:`django.test.TestCase` class.
    """
    def setUp(self):
        """
        Accounts Test Settings

        """
        User.objects.create_user(
            'testuser1@test.com', 'TEST_USER_1', password='TEST_PASSWORD_1'
        )


    def test_models(self):
        """
        Test accounts models

        """
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='', username='swpp', password='iluvswpp'
            )
        User.objects.create_user(
            email='swpp@snu.ac.kr', username='swpp', password='iluvswpp'
        )
        User.objects.create_superuser(
            email='sudo@snu.ac.kr', username='sudo', password='iluvswpp'
        )


    def test_auth_backend(self):
        """
        Test authentication backend

        """
        user = authenticate(
            None, email='testuser1@test.com', password='TEST_PASSWORD_1'
        )
        self.assertNotEqual(user, None)
        user = authenticate(
            None, email='notexist@test.com', password='TEST_PASSWORD_1'
        )
        self.assertEqual(user, None)
        user = authenticate(
            None, email='testuser1@test.com', password='WRONG_PASSWORD_1'
        )
        self.assertEqual(user, None)


    def test_csrf(self):
        """
        Test CSRF Token API

        """
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            '/api/accounts/signup',
            json.dumps({'username': 'chris', 'email': 'chirs@foo.net', 'password': 'chris'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 403)  # Request without csrf token

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post(
            '/api/accounts/signup',
            json.dumps({'username': 'chris', 'email': 'chirs@foo.net', 'password': 'chris'}),
            content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 201)  # Pass csrf protection

        response = client.get('/api/token')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie
        response = client.post(
            '/api/token',
            json.dumps({'username': 'chris', 'password': 'chris'}),
            content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(response.status_code, 405)
        response = client.get('/api/token')
        self.assertEqual(response.status_code, 204)


    def test_signup(self):
        """
        Test Signup API

        """
        client = Client()
        response = client.post(
            '/api/accounts/signup',
            json.dumps({
                'email': 'newuser@new.com',
                'username': 'NEWUSER',
                'password': 'testpass1583'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)

        response = client.post(
            '/api/accounts/signup',
            json.dumps({
                'email': 'newuser@new.com',
                'username': 'NEWUSER',
                'password': 'testpass1583'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 409)

        response = client.post(
            '/api/accounts/signup',
            json.dumps({
                'email': 'newuser@new.com',
                'badkey': 'NEWUSER',
                'password': 'testpass1583'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/accounts/signup')
        self.assertEqual(response.status_code, 405)


    def test_signin(self):
        """
        Test Signin API

        """
        client = Client()
        response = client.post(
            '/api/accounts/signin',
            json.dumps({'email': 'wronguser@new.com', 'password': 'testpass1234'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)

        response = client.post(
            '/api/accounts/signin',
            json.dumps({'badkey': 'wronguser@new.com', 'password': 'testpass1583'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)

        response = client.get('/api/accounts/signin')
        self.assertEqual(response.status_code, 405)

        response = client.post(
            '/api/accounts/signin',
            json.dumps({'email': 'testuser1@test.com', 'password': 'TEST_PASSWORD_1'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)


    def test_signout(self):
        """
        Test Signout API

        """
        client = Client()
        response = client.get('/api/accounts/signout')
        self.assertEqual(response.status_code, 401)

        response = client.post(
            '/api/accounts/signout',
            json.dumps({'badkey': 'WRONGUSER', 'password': 'testpass1583'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

        client2 = Client()
        client2.login(email='testuser1@test.com', password='TEST_PASSWORD_1')

        response = client2.post(
            '/api/accounts/signout',
            json.dumps({'username': 'TESTUSER', 'password': 'testpass1234'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 405)

        response = client2.get('/api/accounts/signout')
        self.assertEqual(response.status_code, 204)
