from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    """
    A class to manage user accounts.
    It extends :class:`django.contrib.auth.models.BaseUserManager` class.
    """
    use_in_migrations = True

    def create_user(self, email, username, password=None):
        """
        A method to create user.
        :param email: Email address
        :type email: str
        :param username: Username
        :type username: str
        :param password: Password
        :type password: str
        :return: Created user instance
        :rtype: :class:`User`
        """
        if not email:
            raise ValueError('must have user email')
        user = self.model(
            email = self.normalize_email(email),
            username = username
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, username, password):
        """
        A method to create superuser.
        :param email: Email address
        :type email: str
        :param username: Username
        :type username: str
        :param password: Password
        :type password: str
        :return: Created user instance
        :rtype: :class:`User`
        """
        user = self.create_user(
            email = self.normalize_email(email),
            username = username,
            password = password
        )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    A class to represent user account.
    It extends :class:`django.contrib.auth.models.AbstractBaseUser` and :class:`django.contrib.auth.models.PermissionsMixin` classes.

    :param email: User's email address (identifier)
    :type email: class:`django.db.models.EmailField`
    :param username: User's username
    :type username: class:`django.db.models.CharField`
    """
    objects = UserManager()

    email = models.EmailField(
        max_length=255,
        unique=True,
    )
    username = models.CharField(
        max_length=20,
        null=False,
        unique=True
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
