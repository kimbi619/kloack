from rest_framework import serializers
from .models import Bank
from django.contrib.auth import get_user_model


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = '__all__'