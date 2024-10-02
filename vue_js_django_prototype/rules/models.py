from django.db import models
from django.utils.translation import gettext_lazy as _


class Rule(models.Model):
    protocol = models.CharField(max_length=50)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    destination_port = models.CharField(max_length=10)

    class Meta:
        verbose_name = _("Regel")
        verbose_name_plural = _("Regeln")

    def __str__(self):
        return f"{self.source} - {self.destination}"
