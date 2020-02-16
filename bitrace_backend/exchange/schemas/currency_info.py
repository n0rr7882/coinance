import graphene

from graphene_django.types import DjangoObjectType
from exchange.models import CurrencyInfo


class CurrencyInfoType(DjangoObjectType):
    class Meta:
        model = CurrencyInfo
