"""
Models of wordlist
"""
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.
class Word(models.Model):
    """
    A class to manage words.
    :param content: word itself (identifier)
    :type content: class:`django.db.models.CharField`
    :param korean_meaning: word's korean meaning
    :type korean_meaning: class:`django.db.models.CharField`
    :param difficulty: word's difficulty
    :type difficulty: class:`django.db.models.IntegerField`
    """
    objects = models.Manager()
    content = models.CharField(max_length=100)
    korean_meaning = models.CharField(max_length=100)
    difficulty = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.content)


class Phrase(models.Model):
    """
    A class to manage phrases.
    :param content: phrase itself (identifier)
    :type content: class:`django.db.models.TextField`
    :param word: keyword in phrase
    :type word: class:`django.db.models.ForeignKey`
    :param confidence: user's confidence about phrase
    :type confidence: class:`django.db.models.IntegerField`
    """
    objects = models.Manager()
    content = models.TextField(blank=False, unique=True)
    word = models.ForeignKey(Word, on_delete=models.CASCADE)

    def __str__(self):
        return f"문장: {str(self.content)}, 단어: {str(self.word.content)}"


class Wordlist(models.Model):
    """
    A class to manage wordlist.
    :param user: user who own's the wordlist (identifier)
    :type user: class:`django.db.models.OneToOneField`
    :param added_phrase: added phrases in wordlist
    :type added_phrase: class:`django.db.models.ManyToManyField`
    """
    objects = models.Manager()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    added_phrase = models.ManyToManyField(Phrase, through="WordlistPhrase", blank=True)

    def __str__(self):
        return f"단어장 소유: {str(self.user.username)}"


# User 생성시에 자동으로 wordlist가 1개 생성되도록 설정
@receiver(post_save, sender=User)
def create_user_wordlist(sender, instance, created, **kwargs):
    """
    A function to create wordlist when a user is created.
    """
    if created:
        Wordlist.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_wordlist(sender, instance, **kwargs):
    """
    A function to save the wordlist create when a user is saved.
    """
    instance.wordlist.save()


class WordlistPhrase(models.Model):
    """
    A class to manage relationship between wordlist and phrase.
    :param wordlist: wordlist in the relation
    :type wordlist: class:`django.db.models.ForeignKey`
    :param phrase: phrase in the relation
    :type phrase: class:`django.db.models.ForeignKey`
    :param created_at: time the phrase is added to wordlist
    :type created_at: class:`django.db.models.DateTimeField`
    """
    objects = models.Manager()
    wordlist = models.ForeignKey(Wordlist, on_delete=models.CASCADE)
    phrase = models.ForeignKey(Phrase, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    confidence = models.IntegerField(default=1)
