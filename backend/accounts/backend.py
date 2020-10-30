from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

class AuthBackend(ModelBackend):
    """
    A class to provide custom authentication.
    It extends :class:`django.contrib.auth.backends.ModelBackend` class.
    """
    def authenticate(self, request, email=None, password=None, **kwargs):
        """
        A method to authenticate user.
        :param username: request
        :type username: HttpRequest
        :param email: Email address
        :type email: str
        :param password: Password
        :type password: str
        :return: Authenticated user instance
        :rtype: :class:`User`
        """
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None

