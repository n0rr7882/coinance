from django.urls import path
from rest_framework import routers

from currency.views.currency_pair import CurrencyPairViewSet
from currency.views.candle_chart import candle_chart_view

router = routers.SimpleRouter()
router.register(r'currency-pairs', CurrencyPairViewSet)

fbv_urls = [
    path('candle-charts/<int:currency_pair_id>/<str:chart_type>/', candle_chart_view),
]

urlpatterns = router.urls + fbv_urls
