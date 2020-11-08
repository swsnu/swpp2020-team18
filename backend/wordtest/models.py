from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()
from wordlist.models import Phrase, Wordlist, AddPhrase

class Question(models.Model):
    nunmber = models.IntegerField(default=0)
    question = models.ForeignKey(Phrase, on_delete=models.CASCADE)
    answer1 = models.CharField(max_length=100)
    answer2 = models.CharField(max_length=100)
    answer3 = models.CharField(max_length=100)
    answer4 = models.CharField(max_length=100)
    correct_answers = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)

# save test result
class TestResult(models.Model):
    TEST_TYPE = ('article', 'wordlist')

    test_date = models.DateTimeField()
    test_type = models.CharField(max_length=10, choices=TEST_TYPE)
    question_count = models.IntegerField(default=20)
    solution_count = models.IntegerField(null=True)
    score = models.DecimalField()

    def __str__(self):
        return "test score: %d" % score

# one user should have one TestHistory model
# create TestHistory when user created
class TestHistory(TestResult):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    test_id = models.IntegerField(primary_key=True,blank=False)

    def __str__(self):
        return "%s's test result history" % self.user_id.username
    
@receiver(post_save, sender=User)
def create_test_history(sender, instance, created, **kwargs):
    if created:
        TestHistory.objects.create(user_id=instance)

@receiver(post_save, sender=User)
def save_test_history(sender, instance, **kwargs):
    instance.TestHistory.save()