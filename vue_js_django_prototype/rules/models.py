from django.db import models


class Rule(models.Model):
    protocol = models.CharField(max_length=50)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    destination_port = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.source} - {self.destination}"
