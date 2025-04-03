from django.urls import path
from .views import create_bank

urlpatterns = [
    path('banks/create/', create_bank, name='create_bank'),
]