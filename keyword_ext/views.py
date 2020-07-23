from django.shortcuts import render


def index(request):
    return_object = {"nav_choice": 2}

    if request.method == "POST":
        return_object["success"] = False
        return_object["keywords"] = []

    return render(request, "keyword_ext/index.html", return_object)
