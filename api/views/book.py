from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Book
from api.serializer import (
    BookSerializer,
    BookDetailSerializer,
)


@api_view(['GET'])
def book_list(request):
    """
    List simple info of all books
    """
    books = Book.objects.all()
    serializer = BookSerializer(books, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def book_detail(request, book_id):
    """
    All info of the Book ( including content )
    """
    try:
        book = Book.objects.get(pk=book_id)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BookDetailSerializer(book)
        return Response(serializer.data)
