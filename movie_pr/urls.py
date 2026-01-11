
from django.contrib import admin
from django.urls import path
from movie.views import homepage,detail,about,actors,actor_detail,countries,genres
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',homepage,name='homepage'),
    path('movie/<int:id>/',detail,name='detail'),
    path('about/',about,name='about'),
    path('actors/',actors,name='actors'),
    path('actor/<slug:slug>/',actor_detail,name='actor_detail'),
    path('countries/',countries,name='countries'),
    path('genres/',genres,name='genres')
]

urlpatterns += static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL,document_root=settings.STATICFILES_DIRS)