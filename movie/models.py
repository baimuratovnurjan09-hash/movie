from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser



from unidecode import unidecode
from django.utils.text import slugify

def generate_unique_slug(instance, field_value, slug_field_name='slug'):
    slug_base = slugify(unidecode(field_value))  # транслитерируем
    unique_slug = slug_base
    num = 1
    ModelClass = instance.__class__

    while ModelClass.objects.filter(**{slug_field_name: unique_slug}).exists():
        unique_slug = f"{slug_base}-{num}"
        num += 1
    return unique_slug



class CustomUser(AbstractUser):
    phone_num = models.CharField(max_length=13,
                                 help_text='+998XXXXXXX',)
    photo = models.ImageField(upload_to='users/')
    card_number = models.CharField(max_length=16,
                                   help_text='9860yyyyxxxx0101',
                                   blank=True,null=True)

    
    
    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'



class Genres(models.Model):
    genre = models.CharField(max_length=100,)
    slug = models.SlugField(unique=True,blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.genre)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.genre
    
class Actors(models.Model):
    full_name = models.CharField(max_length=250,)
    slug = models.SlugField(unique=True,blank=True)
    biography = models.TextField()
    image = models.ImageField(upload_to='actors/')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.full_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name 

class Countries(models.Model):
    name = models.CharField(max_length=250)
    slug = models.SlugField(unique=True,blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=250,)
    slug = models.SlugField(unique=True,blank=True)
    image = models.ImageField(upload_to='posters/')
    year = models.CharField(max_length=4,help_text='ГГГГ')
    description = models.TextField()
    counries = models.ManyToManyField(Countries)
    genres = models.ManyToManyField(Genres)
    actors = models.ManyToManyField(Actors)
    age = models.CharField(max_length=3,default='16+')
    time = models.CharField(max_length=3)
    trailer = models.URLField()
    film = models.FileField(upload_to='films/')

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
