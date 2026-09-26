from django.urls import path
from .views import *
urlpatterns=[
    # as_view() helps us to convert a class based view into a function based view 
    # it maps the request calls to its appropiate function within the class 
    path("register/",RegisterView.as_view(),name="register"),
    path("login/",LoginView.as_view(),name="login"),
    path("profile/",ProfileView.as_view(),name="profile")
]