
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('api/', include('api.urls')),
    path('keyword-ext/', include('keyword_ext.urls')),
    path('qna-valid-chk/', include('qna_valid_chk.urls')),
    path('', include('home.urls')),
]
