from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from vue_js_django_prototype.rules.api.views import RuleModelViewSet
from vue_js_django_prototype.users.api.views import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet)
router.register("rules", RuleModelViewSet)

app_name = "api"
urlpatterns = router.urls
