# Generated by Django 5.1.4 on 2025-02-22 06:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_star_discount'),
    ]

    operations = [
        migrations.AlterField(
            model_name='star_discount',
            name='order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.order'),
        ),
    ]
