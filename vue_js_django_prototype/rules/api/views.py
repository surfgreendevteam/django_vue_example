from rest_framework import viewsets

from vue_js_django_prototype.rules.api.serializers import RuleModelSerializer
from vue_js_django_prototype.rules.models import Rule


class RuleModelViewSet(viewsets.ModelViewSet):
    # https://www.django-rest-framework.org/api-guide/viewsets/#modelviewset
    serializer_class = RuleModelSerializer
    queryset = Rule.objects.all()

    # add permissions, fitering, etc. here
