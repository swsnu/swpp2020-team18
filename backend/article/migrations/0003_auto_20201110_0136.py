# Generated by Django 3.1.2 on 2020-11-09 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wordlist', '__first__'),
        ('article', '0002_auto_20201109_1215'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='phrases',
            field=models.ManyToManyField(to='wordlist.Phrase'),
        ),
        migrations.AlterField(
            model_name='article',
            name='difficulty',
            field=models.IntegerField(default=5),
        ),
    ]
