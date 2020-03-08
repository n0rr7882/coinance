import requests
from django.core.management import BaseCommand

from currency.models import Currency


class Command(BaseCommand):
    help = 'Initialize Currencies on DB from Poloniex API'

    def handle(self, *args, **options):
        response = requests.get('https://poloniex.com/public?command=returnCurrencies')
        currencies: dict = response.json()

        for symbol in currencies.keys():
            currency_data = currencies[symbol]

            Currency.objects.get_or_create(
                symbol=symbol,
                poloniex_id=currency_data['id'],
                defaults=dict(
                    name=currency_data['name']
                )
            )

        return
