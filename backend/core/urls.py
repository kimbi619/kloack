from django.urls import path
from .views import create_bank, authenticate, callback

urlpatterns = [
    path('banks/create/', create_bank, name='create_bank'),
    path('auth/', authenticate, name='authenticate'),
    path('callback/', callback, name='callback'),
]