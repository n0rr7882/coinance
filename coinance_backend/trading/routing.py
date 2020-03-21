from django.urls import path

from trading.websocket.order import OrderConsumer

websocket_urlpatterns = [
    path('ws/orders/', OrderConsumer),
]
