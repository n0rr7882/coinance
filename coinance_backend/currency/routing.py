from django.urls import path

from currency.websocket.currency_pair import CurrencyPairConsumer

websocket_urlpatterns = [
    path('ws/currency-pairs/', CurrencyPairConsumer),
]
