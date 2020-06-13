from django.urls import path
from rest_framework import routers

from trading.views.order import OrderViewSet
from trading.views.wallet import WalletViewSet, wallet_summary_view

router = routers.SimpleRouter()
router.register(r'wallets', WalletViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('wallets/summary/', wallet_summary_view),
] + router.urls
