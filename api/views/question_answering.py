import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import ChoiceQnA, EssayQnA, Book
from api.serializer import (
    ChoiceQnASerializer,
    EssayQnASerializer,
)

QUESTION_TYPE = {
    'CHOICE': 1,
    'ESSAY': 2
}


@api_view(['POST'])
def valid_check(request):
    request = json.loads(request.body)

    content = Book.objects.get(pk=request['book_id']).content
    question = request['question']

    score = valid_check(content, question)['score']
    valid = True if score >= 0.85 else False
    return Response({'valid': valid})


@api_view(['POST'])
def verify_answer(request):
    request = json.loads(request.body)
    content = Book.objects.get(pk=request['book_id']).content
    question = request['question']
    user_answers = request['user_answer']
    # ai_answer = get_answer(content, question)

    if request['question_type'] == QUESTION_TYPE['CHOICE']:
        scores = []
        for answer in user_answers:
            # scores.append(calculate_similarity(ai_answer, answer))
            pass
        ai_choice = [i for i, s in enumerate(scores) if s == max(scores)]
        valid = True if ai_choice == request['user_answer'] else False

        return Response({'valid': valid})


    elif request['question_type'] == QUESTION_TYPE['ESSAY']:
        user_answer = request['user_answer'][0]
        # score = calculate_similarity(ai_answer, answer)
        # valid = True if score >= 0.8 else False
        # return Response({'valid': valid})
        pass


@api_view(['GET'])
def random_qna(request, qtype):
    models = [ChoiceQnA, EssayQnA]
    serializers = [ChoiceQnASerializer, EssayQnASerializer]

    qna = models[qtype].object.order_by('?').fisrt()
    if qna is None:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = serializers[qtype](qna)

    return Response(serializer.data)

