from rest_framework import routers

from trading.views.order import OrderViewSet
from trading.views.wallet import WalletViewSet

router = routers.SimpleRouter()
router.register(r'wallets', WalletViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = router.urls
