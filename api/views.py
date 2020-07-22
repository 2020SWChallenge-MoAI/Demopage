from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Book
from .serializer import (
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
def book_detail(request, pk):
    """
    :param pk: Book id
    :return: All info of the Book
    """
    try:
        # pk: primary key
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BookDetailSerializer(book)
        return Response(serializer.data)

    # elif request.method == 'POST':
    #     serializer = BookDetailSerializer(book, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #     return Response(serializer.data)


@api_view(['GET'])
def get_keywords(request):
    parents = request.data
    pass
