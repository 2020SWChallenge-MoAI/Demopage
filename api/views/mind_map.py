import json
from os.path import dirname, join
from rest_framework.response import Response
from rest_framework.decorators import api_view
from keyext import KeywordExtractor

model_path = join(dirname(dirname(dirname('__file__'))), 'data_handler/data/model.pkl')
keyword_extractor = KeywordExtractor(model_path=model_path)


@api_view(['POST'])
def suggestion(request):
    request = json.loads(request.body)
    suggestions = keyword_extractor.recommend(request['book_id'], request['ancestors'][:-1])
    return Response({'suggestions': suggestions})