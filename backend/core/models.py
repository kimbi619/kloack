from django.db import models



class Bank(models.Model): 
    """
    Bank model to test
    """
    name = models.CharField(max_length=255)

    address = models.CharField(max_length=255)

    city = models.CharField(max_length=255)

    state = models.CharField(max_length=255)

    zip_code = models.CharField(max_length=10)
    
    country = models.CharField(max_length=255)

    def __str__(self):
        return self.name