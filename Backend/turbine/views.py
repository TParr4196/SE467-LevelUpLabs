# # views.py
# from django.shortcuts import render

# from django.views import View

# class IndexView(View):
#     def get(self, request):
#         print("please")
#         return render(request, 'index.html')
    

from django.views.generic.base import RedirectView

class StaticIndexRedirectView(RedirectView):
    url = '/static/index.html'
