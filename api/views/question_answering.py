import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import ChoiceQnA, EssayQnA, Book
from api.serializer import (
    ChoiceQnASerializer,
    EssayQnASerializer,
)

from question_answering import KoELECTRA
from question_answering import f1_score, exact_match_score

electra = KoELECTRA("monologg/koelectra-base-v2-finetuned-korquad")

QUESTION_TYPE = {
    'CHOICE': 0,
    'ESSAY': 1
}


@api_view(['POST'])
def valid_check(request):
    request = json.loads(request.body)

    content = Book.objects.get(pk=request['book_id']).content
    question = request['question']
    score = electra.get_answer(context=content, question=question,)[0]['score']
    valid = True if score >= 0.85 else False
    return Response({'valid': valid})


@api_view(['POST'])
def verify_answer(request):
    request = json.loads(request.body)
    content = Book.objects.get(pk=request['book_id']).content
    question = request['question']
    ai_outputs = electra.get_answer(question=question, context=content, topk=1)
    ai_option = ai_outputs[0]['answer']

    if request['question_type'] == QUESTION_TYPE['CHOICE']:
        scores = []
        for option in request['user_options']:
            scores.append(f1_score(ai_option, option))
        ai_answer = [i for i, s in enumerate(scores) if s == max(scores)]
        valid = True if ai_answer == int(request['user_answer']) else False
        return Response({'valid': valid})

    else:
        score = f1_score(ai_option, request['user_answer'])
        valid = True if score >= 0.5 else False
        return Response({'valid': valid,'question':question, 'ai_outputs': ai_outputs})


@api_view(['GET'])
def random_qna(request, qtype):
    models = (ChoiceQnA, EssayQnA,)
    serializers = (ChoiceQnASerializer, EssayQnASerializer,)
    qna = models[qtype].objects.order_by('?').first()
    serializer = serializers[qtype](qna)

    return Response(serializer.data)
