from django.urls import path
from .views import create_bank, authenticate, callback, test_keycloak_connection

urlpatterns = [
    path('banks/create/', create_bank, name='create_bank'),
    path('auth/', authenticate, name='authenticate'),
    path('callback/', callback, name='callback'),
    path('test-keycloak-connection/', test_keycloak_connection, name='test_keycloak_connection'),
]