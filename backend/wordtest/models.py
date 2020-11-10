from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
User = get_user_model()
from wordlist.models import Word, Phrase, Wordlist, WordlistPhrase

class Question(models.Model):
    """
    A class to represent questions in test
    :param taker: User who take test
    :type taker: class:`django.db.models.ForeignKey`
    :param question: a selected phrase
    :type question: class:`django.db.models.ForeignKey`
    :param number: the question number
    :type number: class: django.db.models.IntegerField
    :param answer1, 2, 3, 4: question choices
    :type answer1, 2, 3, 4: class:`django.db.models.TextField`
    :param correct_answer: the number of correct answer
    :type correct_answer: class: django.db.models.IntegerField
    :param completed: mean test is completed or not
    :type completed: class: django.db.models.BooleanField
    """
    taker = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    question = models.ForeignKey(
        Phrase,
        on_delete=models.CASCADE
    )
    number = models.IntegerField(default=0)
    answer1 = models.CharField(max_length=100)
    answer2 = models.CharField(max_length=100)
    answer3 = models.CharField(max_length=100)
    answer4 = models.CharField(max_length=100)
    correct_answers = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.question

class TestResult(models.Model):
    """
    A class to save test result
    there are two types of test, 'AR' for article and 'WL' for word list.
    :param test_date: date when test is taken
    :type test_date: class:`django.db.models.DateTimeField`
    :param test_type: two types of test
    :type test_type: class:`django.db.models.CharField`
    :param question_count: the count of questions
    :type question_count: class:`django.db.models.IntegerField`
    :param solution_count: the count of corrected
    :type solution_count: class:`django.db.models.IntegerField`
    :param score: score of the test
    :type score: class:`django.db.models.DecimalField`
    """
    TEST_TYPE = [
        ('AR','article'),
        ('WL','wordlist'),
    ]

    test_date = models.DateTimeField()
    test_type = models.CharField(max_length=10, choices=TEST_TYPE)
    question_count = models.IntegerField(default=20)
    solution_count = models.IntegerField(null=True)
    score = models.DecimalField(max_digits=4, decimal_places=2)

    def __str__(self):
        return "test score: %d" % score

# one user should have one TestHistory model
# create TestHistory when user created
class TestHistory(TestResult):
    """
    A class to save the user's test history
    :param user_id: user id who own this model
    :type user_id: class:`django.db.models.ForeignKey`
    :param test_id: test id which mean order of the test
    :type test_id: class:`django.db.models.IntegerField`
    """
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