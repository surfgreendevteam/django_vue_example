from django.urls import reverse_lazy
from django.views.generic import ListView

from vue_js_django_prototype.rules.models import Rule


class RuleListCreateView(ListView):
    model = Rule
    template_name = 'rules/rule_list_create.html'
    context_object_name = 'rules'
    success_url = reverse_lazy('rule_list_create')
    fields = ['protocol', 'source', 'destination', 'destination_port']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
