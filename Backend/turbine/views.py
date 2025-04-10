# views.py
from django.shortcuts import render

def home(request):
    print("please")
    return render(request, 'home.html')