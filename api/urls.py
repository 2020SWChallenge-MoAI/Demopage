from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from api import views


urlpatterns = [
    path('books',views.book_list),
    path('books/<int:pk>', views.book_detail),
    path('mind-map', views.get_keyword)
]

urlpatterns = format_suffix_patterns(urlpatterns)
