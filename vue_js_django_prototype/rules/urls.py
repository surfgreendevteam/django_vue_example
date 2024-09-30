from django.urls import path

from vue_js_django_prototype.rules.views import RuleListCreateView

app_name = "rules"


urlpatterns = [
    path("", RuleListCreateView.as_view(), name="rule_list_create"),
]
