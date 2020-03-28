from django.urls import path

from trading.websocket.order import OrderConsumer
from trading.websocket.wallet import WalletConsumer

websocket_urlpatterns = [
    path('ws/orders/', OrderConsumer),
    path('ws/wallets/', WalletConsumer),
]
