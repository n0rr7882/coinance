from rest_framework import routers

from user.views import UserViewSet

router = routers.SimpleRouter()
router.register(r'', UserViewSet)

urlpatterns = router.urls
