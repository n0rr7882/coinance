from rest_framework import routers

from user.views import UserSettingViewSet

router = routers.SimpleRouter()
router.register(r'settings', UserSettingViewSet)

urlpatterns = router.urls
