// === CAROUSEL FUNCTIONALITY ===
function initCarousels() {
    const carouselSections = document.querySelectorAll('.featured-carousel-section');
    
    carouselSections.forEach((section, index) => {
        const track = section.querySelector('.carousel-track');
        const prevBtn = section.querySelector('.prev-btn');
        const nextBtn = section.querySelector('.next-btn');
        const cards = section.querySelectorAll('.carousel-card');
        
        if (!track || !prevBtn || !nextBtn || cards.length === 0) return;
        
        let currentPosition = 0;
        const cardWidth = 270; // 250px ширина + 20px gap
        const visibleCards = Math.floor(window.innerWidth / cardWidth);
        const maxScroll = Math.max(0, cards.length - visibleCards);
        
        // Обновление позиции
        function updatePosition() {
            track.style.transform = `translateX(-${currentPosition * cardWidth}px)`;
            prevBtn.disabled = currentPosition === 0;
            nextBtn.disabled = currentPosition >= maxScroll;
        }
        
        // Кнопка "Вперед"
        nextBtn.addEventListener('click', () => {
            if (currentPosition < maxScroll) {
                currentPosition++;
                updatePosition();
            }
        });
        
        // Кнопка "Назад"
        prevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                currentPosition--;
                updatePosition();
            }
        });
        
        // Начальная настройка
        updatePosition();
        
        // Обновление при изменении размера окна
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentPosition = 0;
                updatePosition();
            }, 250);
        });
    });
}

// Запуск после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}

// === HEADER SCROLL EFFECT ===
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header && window.scrollY > 50) {
        header.classList.add('scrolled');
    } else if (header) {
        header.classList.remove('scrolled');
    }
});

// === ADVANCED SEARCH TOGGLE ===
// Этот код перенесен в HTML файл для избежания конфликтов

// === MOBILE MENU TOGGLE ===
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Анимация иконки бургера
        const spans = this.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// === MOBILE SEARCH TOGGLE ===
const mobileSearchToggle = document.querySelector('.mobile-search-toggle');
const mobileSearch = document.querySelector('.mobile-search');

if (mobileSearchToggle && mobileSearch) {
    mobileSearchToggle.addEventListener('click', function() {
        mobileSearch.style.display = mobileSearch.style.display === 'block' ? 'none' : 'block';
    });
}

// === SEARCH FUNCTIONALITY ===
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const mobileSearchInput = document.querySelector('.mobile-search-input');

if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (!query) {
            e.preventDefault();
            alert('Введите запрос для поиска');
        }
    });
}

// Поиск по Enter
if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchForm.submit();
        }
    });
}

if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                window.location.href = `/?q=${encodeURIComponent(query)}`;
            }
        }
    });
}

// === FILTER TABS ===
const filterTabs = document.querySelectorAll('.filter-tab');

filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        // Удаляем активный класс со всех табов
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // Добавляем активный класс к нажатому табу
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Здесь можно добавить логику фильтрации
        console.log('Фильтр:', filter);
    });
});

// === MOVIE CARD INTERACTIONS ===
const movieCards = document.querySelectorAll('.movie-card');

movieCards.forEach(card => {
    // Клик на карточку
    card.addEventListener('click', function(e) {
        // Если клик не на кнопку действия
        if (!e.target.closest('.action-btn') && !e.target.closest('.play-btn')) {
            const movieId = this.getAttribute('data-id');
            // Перенаправление на страницу фильма
            window.location.href = `/movie/${movieId}/`;
        }
    });
    
    // Кнопка воспроизведения
    const playBtn = card.querySelector('.play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieId = card.getAttribute('data-id');
            window.location.href = `/watch/${movieId}/`;
        });
    }
    
    // Кнопка избранного
    const favoriteBtn = card.querySelector('.action-btn:first-child');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle класса для визуального эффекта
            this.classList.toggle('favorited');
            
            // SVG иконка
            const svg = this.querySelector('svg path');
            if (this.classList.contains('favorited')) {
                svg.setAttribute('fill', 'currentColor');
                showNotification('Добавлено в избранное');
            } else {
                svg.setAttribute('fill', 'none');
                showNotification('Удалено из избранного');
            }
            
            // Здесь можно добавить AJAX запрос для сохранения в БД
            const movieId = card.getAttribute('data-id');
            console.log('Toggle favorite for movie:', movieId);
        });
    }
    
    // Кнопка трейлера
    const trailerBtn = card.querySelector('.action-btn:last-child');
    if (trailerBtn) {
        trailerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieId = card.getAttribute('data-id');
            openTrailerModal(movieId);
        });
    }
});

// === NOTIFICATION SYSTEM ===
function showNotification(message) {
    // Создаем элемент уведомления
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
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// === TRAILER MODAL ===
function openTrailerModal(movieId) {
    // Создаем модальное окно для трейлера
    const modal = document.createElement('div');
    modal.className = 'trailer-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div class="modal-content" style="width: 90%; max-width: 900px; position: relative;">
            <button class="modal-close" style="position: absolute; top: -40px; right: 0; background: transparent; color: white; font-size: 30px; cursor: pointer; z-index: 1;">✕</button>
            <div style="position: relative; padding-bottom: 56.25%; height: 0;">
                <iframe 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Закрытие модального окна
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', closeTrailerModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeTrailerModal();
        }
    });
}

function closeTrailerModal() {
    const modal = document.querySelector('.trailer-modal');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// === ANIMATIONS ===
// Добавляем стили для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOutDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .movie-card {
        opacity: 1;
        transform: scale(1);
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// === LAZY LOADING IMAGES ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// === ESCAPE KEY HANDLER ===
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Закрываем мобильное меню
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        // Закрываем расширенный поиск
        if (advancedSearchPanel && advancedSearchPanel.classList.contains('active')) {
            advancedSearchPanel.classList.remove('active');
        }
        
        // Закрываем модальное окно трейлера
        closeTrailerModal();
    }
});

// === PAGE LOAD ANIMATION ===
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Анимация появления карточек фильмов
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
});

console.log('CinemaHub initialized successfully!');