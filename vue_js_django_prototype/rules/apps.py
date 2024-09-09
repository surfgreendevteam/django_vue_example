import contextlib

from django.apps import AppConfig


class RulesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "vue_js_django_prototype.rules"

    def ready(self):
        with contextlib.suppress(ImportError):
            import vue_js_django_prototype.rules.signals  # noqa: F401
