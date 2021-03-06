# Generated by Django 3.1.2 on 2020-11-10 15:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wordlist', '__first__'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='TestResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('test_date', models.DateTimeField()),
                ('test_type', models.CharField(choices=[('AR', 'article'), ('WL', 'wordlist')], max_length=10)),
                ('question_count', models.IntegerField(default=20)),
                ('solution_count', models.IntegerField(null=True)),
                ('score', models.DecimalField(decimal_places=2, max_digits=4)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(default=0)),
                ('answer1', models.CharField(max_length=100)),
                ('answer2', models.CharField(max_length=100)),
                ('answer3', models.CharField(max_length=100)),
                ('answer4', models.CharField(max_length=100)),
                ('correct_answers', models.IntegerField(default=0)),
                ('completed', models.BooleanField(default=False)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wordlist.phrase')),
                ('taker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TestHistory',
            fields=[
                ('testresult_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, to='wordtest.testresult')),
                ('test_id', models.IntegerField(primary_key=True, serialize=False)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            bases=('wordtest.testresult',),
        ),
    ]
