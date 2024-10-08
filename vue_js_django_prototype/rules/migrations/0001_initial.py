# Generated by Django 5.0.9 on 2024-09-09 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('protocol', models.CharField(max_length=50)),
                ('source', models.CharField(max_length=100)),
                ('destination', models.CharField(max_length=100)),
                ('destination_port', models.CharField(max_length=10)),
            ],
            options={
                'verbose_name': 'Regel',
                'verbose_name_plural': 'Regeln',
            },
        ),
    ]
