// === VIDEO PLAYER ===
const moviePlayer = document.getElementById('moviePlayer');

if (moviePlayer) {
    // Сохранение прогресса просмотра
    const movieId = window.location.pathname.split('/').filter(Boolean).pop();
    
    // Загрузка прогресса
    window.addEventListener('load', function() {
        const savedProgress = localStorage.getItem(`watch_progress_${movieId}`);
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            if (progress.time > 10 && moviePlayer.duration && progress.time < moviePlayer.duration - 30) {
                if (confirm(`Продолжить просмотр с ${formatTime(progress.time)}?`)) {
                    moviePlayer.currentTime = progress.time;
                }
            }
        }
    });
    
    // Сохранение прогресса
    moviePlayer.addEventListener('timeupdate', function() {
        if (this.currentTime > 10) {
            localStorage.setItem(`watch_progress_${movieId}`, JSON.stringify({
                time: this.currentTime,
                duration: this.duration,
                timestamp: Date.now()
            }));
        }
    });
    
    // Очистка прогресса при завершении
    moviePlayer.addEventListener('ended', function() {
        localStorage.removeItem(`watch_progress_${movieId}`);
        showNotification('Фильм завершен!');
    });
    
    // Предотвращение контекстного меню
    moviePlayer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// === PLAY BUTTON ===
const btnPlay = document.querySelector('.btn-play');
if (btnPlay) {
    btnPlay.addEventListener('click', function() {
        // Скроллим к плееру
        const playerSection = document.querySelector('.movie-player-section');
        if (playerSection) {
            playerSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Запускаем видео через 500мс
            setTimeout(() => {
                if (moviePlayer) {
                    moviePlayer.play();
                }
            }, 500);
        }
    });
}

// === TRAILER BUTTON ===
const btnTrailer = document.querySelector('.btn-trailer');
const trailerSection = document.querySelector('.trailer-section');

if (btnTrailer && trailerSection) {
    btnTrailer.addEventListener('click', function() {
        trailerSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Добавляем эффект подсветки
        trailerSection.style.animation = 'pulse 1s ease';
        setTimeout(() => {
            trailerSection.style.animation = '';
        }, 1000);
    });
}

// === FAVORITE BUTTON ===
const btnFavorite = document.querySelector('.btn-favorite');

if (btnFavorite) {
    // Проверяем, есть ли фильм в избранном (из localStorage)
    const movieId = window.location.pathname.split('/').filter(Boolean).pop();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.includes(movieId)) {
        btnFavorite.classList.add('active');
        btnFavorite.querySelector('svg path').setAttribute('fill', 'white');
    }

    btnFavorite.addEventListener('click', function() {
        this.classList.toggle('active');
        const svg = this.querySelector('svg path');
        
        if (this.classList.contains('active')) {
            svg.setAttribute('fill', 'white');
            addToFavorites(movieId);
            showNotification('✓ Добавлено в избранное');
        } else {
            svg.setAttribute('fill', 'none');
            removeFromFavorites(movieId);
            showNotification('Удалено из избранного');
        }
    });
}

function addToFavorites(movieId) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.includes(movieId)) {
        favorites.push(movieId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    // Можно добавить AJAX запрос к серверу
    // fetch('/api/favorites/add/', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CSRFToken': getCookie('csrftoken')
    //     },
    //     body: JSON.stringify({ movie_id: movieId })
    // });
}

function removeFromFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(id => id !== movieId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // AJAX запрос к серверу
    // fetch('/api/favorites/remove/', { ... });
}

// === SHARE BUTTON ===
const btnShare = document.querySelector('.btn-share');

if (btnShare) {
    btnShare.addEventListener('click', async function() {
        const movieTitle = document.querySelector('.movie-title-large').textContent;
        const shareData = {
            title: movieTitle,
            text: `Посмотри этот фильм: ${movieTitle}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showNotification('✓ Ссылка успешно отправлена');
            } else {
                // Fallback - копирование в буфер обмена
                await navigator.clipboard.writeText(window.location.href);
                showNotification('✓ Ссылка скопирована в буфер обмена');
            }
        } catch (err) {
            console.error('Ошибка при попытке поделиться:', err);
        }
    });
}

// === ACTOR CARDS ===
const actorCards = document.querySelectorAll('.actor-card');

actorCards.forEach(card => {
    card.addEventListener('click', function() {
        const actorLink = this.querySelector('.actor-link');
        if (actorLink) {
            window.location.href = actorLink.getAttribute('href');
        }
    });
});

// === SIMILAR MOVIES ===
const similarMovieCards = document.querySelectorAll('.similar-section .movie-card');

similarMovieCards.forEach(card => {
    card.addEventListener('click', function() {
        const movieId = this.getAttribute('data-id');
        if (movieId) {
            window.location.href = `/movie/${movieId}/`;
        }
    });
});

// === NOTIFICATION FUNCTION ===
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #1a1a1a;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        z-index: 10000;
        animation: slideInUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// === PARALLAX EFFECT ===
window.addEventListener('scroll', function() {
    const movieHero = document.querySelector('.movie-hero');
    if (movieHero) {
        const scrolled = window.pageYOffset;
        movieHero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// === ANIMATIONS ON SCROLL ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Анимируем секции при скролле
const sections = document.querySelectorAll('.actors-section, .trailer-section, .similar-section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// === POSTER HOVER EFFECT ===
const posterLarge = document.querySelector('.movie-poster-large');

if (posterLarge) {
    posterLarge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    posterLarge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// === GENRE TAGS ANIMATION ===
const genreTags = document.querySelectorAll('.genre-tag');

genreTags.forEach((tag, index) => {
    tag.style.opacity = '0';
    tag.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        tag.style.transition = 'all 0.4s ease';
        tag.style.opacity = '1';
        tag.style.transform = 'translateX(0)';
    }, index * 100);
});

// === ACTOR CARDS STAGGER ANIMATION ===
const actorsGrid = document.querySelector('.actors-grid');

if (actorsGrid) {
    const actorCardsAnim = actorsGrid.querySelectorAll('.actor-card');
    
    const actorObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    actorCardsAnim.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        actorObserver.observe(card);
    });
}

// === TRAILER AUTOPLAY ON SCROLL ===
const trailerIframe = document.querySelector('.trailer-section iframe');

if (trailerIframe) {
    const trailerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Можно добавить автовоспроизведение
                console.log('Трейлер в видимой области');
            }
        });
    }, { threshold: 0.5 });
    
    trailerObserver.observe(trailerIframe);
}

// === GET CSRF TOKEN ===
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// === PULSE ANIMATION ===
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(style);

// === PAGE LOAD ANIMATIONS ===
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.movie-hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }
});

console.log('Movie detail page initialized!');