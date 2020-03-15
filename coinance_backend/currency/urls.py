from django.urls import path
from rest_framework import routers

from currency.views.currency_pair import CurrencyPairViewSet

router = routers.SimpleRouter()
router.register(r'currency-pairs', CurrencyPairViewSet)

urlpatterns = router.urls
