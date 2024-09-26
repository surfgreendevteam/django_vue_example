from rest_framework import serializers

from vue_js_django_prototype.rules.models import Rule


class RuleModelSerializer(serializers.ModelSerializer):
    # https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
    class Meta:
        model = Rule
        fields = "__all__"
