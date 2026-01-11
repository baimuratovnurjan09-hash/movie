from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

from .models import Movie, Genres, Countries, Actors

def homepage(request):
    # Получаем параметры поиска
    query = request.GET.get('q')
    year = request.GET.get('year')
    genre = request.GET.get('genre')
    country = request.GET.get('country')

    # Базовый запрос
    movie_list = Movie.objects.all().order_by('-id')

    # Фильтрация по названию/описанию
    if query:
        movie_list = movie_list.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )

    # Фильтрация по году
    if year:
        movie_list = movie_list.filter(year=year)

    # Фильтрация по жанру
    if genre:
        movie_list = movie_list.filter(genres__genre=genre)

    # Фильтрация по стране
    if country:
        movie_list = movie_list.filter(countries__name=country)

    # Убираем дубликаты
    movie_list = movie_list.distinct()

    # Данные для фильтров
    genres = Genres.objects.all().order_by('genre')
    countries = Countries.objects.all().order_by('name')
    years = Movie.objects.values_list('year', flat=True).distinct().order_by('-year')

    # Пагинация
    paginator = Paginator(movie_list, 12)
    page = request.GET.get('page')

    try:
        movies = paginator.page(page)
    except PageNotAnInteger:
        movies = paginator.page(1)
    except EmptyPage:
        movies = paginator.page(paginator.num_pages)

    return render(request, 'home.html', {
        'movie': Movie.objects.all()[:10],  # Для каруселей
        'movies_paginated': movies,
        'query': query,
        'year': year,
        'genre': genre,
        'country': country,
        'genres': genres,
        'countries': countries,
        'years': years,
    })
   


def detail(request,id):
    detail = get_object_or_404(Movie,id=id)
    return render(request,'detail.html',{'detail':detail})

def about(request):
    return render(request, 'about.html')

def actors(request):
    actors = Actors.objects.all()
    return render(request, 'actors.html', {'actors': actors} )

def actor_detail(request, slug):
    actor = get_object_or_404(Actors, slug=slug)
    return render(request, 'actor_detail.html', {'actor':actor})

def countries(request):
    countries = Countries.objects.all()
    return render(request, 'countries.html' ,{'countries':countries})

def genres(request):
    genres = Genres.objects.all()
    return render(request, 'genres.html', {'genres': genres}) 

