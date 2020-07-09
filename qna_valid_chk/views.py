from django.shortcuts import render

def index(request):
    return render(request, "qna_valid_chk/index.html", {"nav_choice": 3})