from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
import json


@api_view(['POST'])
def suggestion(request):
    ancestors = json.loads(request.body)['ancestors']
    ancestors[0] = "Random"
    return Response({'suggestions': ancestors})
