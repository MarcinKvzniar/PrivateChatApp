# Generated by Django 5.1.3 on 2024-12-19 20:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_friendinvitation_receiver_answer_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friendinvitation',
            name='answer',
        ),
    ]