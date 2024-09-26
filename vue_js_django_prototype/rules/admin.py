# Register your models here.
from django.contrib import admin

from vue_js_django_prototype.rules.models import Rule


class RuleAdmin(admin.ModelAdmin):
    list_display = ("id", "protocol", "source", "destination", "destination_port")
    search_fields = ("protocol", "source", "destination")


admin.site.register(Rule, RuleAdmin)
