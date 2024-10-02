import json

from django.core.serializers.json import DjangoJSONEncoder
from django.urls import reverse_lazy
from django.views.generic import ListView

from vue_js_django_prototype.rules.models import Rule


class RuleListCreateView(ListView):
    model = Rule
    template_name = "rules/rule_list_create.html"
    context_object_name = "rules"
    success_url = reverse_lazy("rule_list_create")
    fields = ["id", "protocol", "source", "destination", "destination_port"]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Serialize the object to JSON
        # https://docs.djangoproject.com/en/5.0/topics/serialization/#serialization-formats-json
        context["rules_json"] = json.dumps(
            list(
                Rule.objects.values(
                    "id",
                    "protocol",
                    "source",
                    "destination",
                    "destination_port",
                ),
            ),
            cls=DjangoJSONEncoder,
        )
        return context
