from django.contrib import admin

# Register your models here.
from .models import CustomUser,Genres,Actors,Countries,Movie

admin.site.register(CustomUser)
admin.site.register(Genres)
admin.site.register(Actors)
admin.site.register(Countries)
admin.site.register(Movie)
