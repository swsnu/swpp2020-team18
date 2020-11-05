# TODO
# model을 어떤 방식으로 사용할지 정한 후에 TODO 처리해야 한다.

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.
class Phrase(models.Model):
    phrase_content = models.TextField(blank=True, default="")
    phrase_keyword = models.CharField(max_length=100)

    def __str__(self):
        return self.phrase_keyword

class Wordlist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    # TODO
    # null=True에 대해 다시 생각해볼 필요가 있다.

    # TODO
    # added_word = models.ManyToManyField(Word, through='AddWord', blank=True)
    added_phrase = models.ManyToManyField(Phrase, through='AddPhrase', blank=True)

    def __str__(self):
        return f'단어장 소유: {str(self.user.username)}'

# User 생성시에 자동으로 wordlist가 1개 생성되도록 설정
@receiver(post_save, sender=User)
def create_user_wordlist(sender, instance, created, **kwargs):
    if created:
        Wordlist.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_wordlist(sender, instance, **kwargs):  
    instance.wordlist.save()

# TODO
# class Word(models.Model):
#     word_name = models.CharField(max_length=100)

#     def __str__(self):
#         return self.word_name

# TODO
# class AddWord(models.Model):
#     wordlist = models.ForeignKey(Wordlist, on_delete=models.CASCADE)
#     word = models.ForeignKey(Word, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)

class AddPhrase(models.Model):
    wordlist = models.ForeignKey(Wordlist, on_delete=models.CASCADE)
    phrase = models.ForeignKey(Phrase, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)