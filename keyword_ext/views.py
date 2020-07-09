from django.shortcuts import render

def index(request):
    return render(request, "keyword_ext/index.html", {"nav_choice": 2})