// === GENRE SEARCH ===
const genreSearchInput = document.getElementById('genreSearch');
const genresGrid = document.getElementById('genresGrid');
const genreCards = document.querySelectorAll('.genre-card');
const noResults = document.querySelector('.no-results-genres');

if (genreSearchInput) {
    genreSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCount = 0;

        genreCards.forEach(card => {
            const genreName = card.getAttribute('data-name');
            
            if (genreName.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Показать/скрыть сообщение "ничего не найдено"
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            genresGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            genresGrid.style.display = 'grid';
        }
    });
}

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
}, observerOptions);

// Анимация карточек при загрузке
genreCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';
    observer.observe(card);
});

// === KEYBOARD NAVIGATION ===
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + F для фокуса на поиске
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (genreSearchInput) {
            genreSearchInput.focus();
        }
    }
});

// === GENRE CARD HOVER EFFECT ===
genreCards.forEach(card => {
    const icon = card.querySelector('.genre-icon');
    
    card.addEventListener('mouseenter', function() {
        icon.style.transform = 'scale(1.1) rotate(-5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// === DEBOUNCE FUNCTION ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Оптимизация поиска с debounce
if (genreSearchInput) {
    const debouncedSearch = debounce(function(searchTerm) {
        let visibleCount = 0;

        genreCards.forEach(card => {
            const genreName = card.getAttribute('data-name');
            
            if (genreName.includes(searchTerm.toLowerCase())) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResults.style.display = 'block';
            genresGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            genresGrid.style.display = 'grid';
        }
    }, 300);

    genreSearchInput.addEventListener('input', function() {
        debouncedSearch(this.value.trim());
    });
}

// === POPULAR GENRES HIGHLIGHT ===
window.addEventListener('load', function() {
    genreCards.forEach(card => {
        const countText = card.querySelector('.genre-count').textContent;
        const count = parseInt(countText);
        
        // Если больше 10 фильмов - добавляем класс "популярный"
        if (count > 10) {
            card.classList.add('popular-genre');
        }
    });
});

// === PAGE LOAD ANIMATION ===
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

console.log('Genres page initialized!');