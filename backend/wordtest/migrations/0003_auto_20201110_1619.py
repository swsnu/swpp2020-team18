# Generated by Django 3.1.2 on 2020-11-10 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wordtest', '0002_auto_20201110_1614'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testhistory',
            name='test_id',
            field=models.IntegerField(blank=True, primary_key=True, serialize=False),
        ),
    ]
