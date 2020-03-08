import json

from django.conf import settings
from django.core.management import BaseCommand

from currency.models import Currency, CurrencyPair
from poloniex.management.commands.currency_pair_map_list import CURRENCY_PAIR_MAP_LIST


class Command(BaseCommand):
    help = 'Initialize Currency pairs on DB from `currency_pair_map_list`.'

    def handle(self, *args, **options):
        for currency_pair_data in CURRENCY_PAIR_MAP_LIST:
            currency_from = Currency.objects.filter(symbol=currency_pair_data['from']).first()
            currency_to = Currency.objects.filter(symbol=currency_pair_data['to']).first()

            if not (currency_from and currency_to):
                continue

            CurrencyPair.objects.get_or_create(
                poloniex_id=currency_pair_data['id'],
                currency_from=currency_from,
                currency_to=currency_to,
            )

        return
