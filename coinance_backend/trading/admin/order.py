from django.contrib import admin

from trading.models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass
