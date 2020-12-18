from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

User = get_user_model()
from wordlist.models import Word, Phrase, Wordlist, WordlistPhrase


class History(models.Model):
    """
    A class to represent history of tests
    """
    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    learned_word = models.ManyToManyField(Word, through="HistoryWord", blank=True)

    def __str__(self):
        return f"{str(self.user.username)}의 학습 데이터"

    @receiver(post_save, sender=User)
    def create_user_history(sender, instance, created, **kwargs):
        """
        A function to create history when a user is created.
        Function with unused argument.
        """
        _ = (sender, kwargs,)
        if created:
            History.objects.create(user=instance)


    @receiver(post_save, sender=User)
    def save_user_history(sender, instance, **kwargs):
        """
        A function to save the history create when a user is saved.
        Function with unused argument.
        """
        _ = (sender, kwargs,)
        instance.history.save()

class HistoryWord(models.Model):
    """
    A class to manage relationship between history and word.
    :param history: history in the relation
    :type history: class:`django.db.models.ForeignKey`
    :param word: word in the relation
    :type word: class:`django.db.models.ForeignKey`
    :param created_at: time the word is added to history
    :type created_at: class:`django.db.models.DateTimeField`
    """
    objects = models.Manager()
    history = models.ForeignKey(History, on_delete=models.CASCADE)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    confidence = models.IntegerField(default=1)
