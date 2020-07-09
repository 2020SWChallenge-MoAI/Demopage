from django.urls import path
from keyword_ext.views import index

urlpatterns = [
    path('', index)
]