"""bitrace_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from user.views import me_view, change_password_view

builtin_urls = [
    path('admin/', admin.site.urls),
    path('auth/session/', include('rest_framework.urls')),
    path('auth/login/', include('rest_social_auth.urls_jwt_pair')),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', me_view, name='me'),
    path('auth/me/change-password', change_password_view, name='change_password'),
]

local_app_urls = [
    path('users/', include('user.urls')),
    path('currency/', include('currency.urls')),
]

urlpatterns = builtin_urls + local_app_urls
