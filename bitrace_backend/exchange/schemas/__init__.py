import graphene

from .currency_info import CurrencyInfoType
from exchange.models import CurrencyInfo


class ExchangeQuery(object):
    all_currency_infos = graphene.List(CurrencyInfoType)

    def resolve_all_currency_infos(self, info, **kwargs):
        return CurrencyInfo.objects.all()
