from django.urls import path
from qna_valid_chk.views import index

urlpatterns = [
    path('', index)
]