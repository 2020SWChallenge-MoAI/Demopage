from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter

from api.views.book import book_list, book_detail
from api.views import question_answering
from api.views import mind_map

urlpatterns = [
    path('books/', book_list),
    path('books/<int:book_id>', book_detail),
    path('qna/valid-check/', question_answering.valid_check),
    path('qna/verify-answer/', question_answering.verify_answer),
    path('qna/random/<int:qtype>', question_answering.random_qna),
    path('mind-map/suggestion/', mind_map.suggestion)
]