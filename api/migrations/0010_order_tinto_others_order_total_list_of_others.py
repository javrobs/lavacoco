# Generated by Django 5.1.4 on 2025-01-23 20:19

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_faq'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='tinto_others',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='total',
            field=models.IntegerField(null=True),
        ),
        migrations.CreateModel(
            name='List_Of_Others',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('concept', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.price')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.order')),
            ],
        ),
    ]
