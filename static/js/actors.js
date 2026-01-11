// === ACTOR SEARCH ===
const actorSearchInput = document.getElementById('actorSearch');
const actorsGrid = document.getElementById('actorsGrid');
const actorCards = document.querySelectorAll('.actor-card');
const noResults = document.querySelector('.no-results-actors');

if (actorSearchInput) {
    actorSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        let visibleCount = 0;

        actorCards.forEach(card => {
            const actorName = card.getAttribute('data-name');
            
            if (actorName.includes(searchTerm)) {
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
            actorsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            actorsGrid.style.display = 'grid';
        }
    });
}

// === ALPHABET FILTER ===
const alphabetButtons = document.querySelectorAll('.alphabet-btn');

alphabetButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс со всех кнопок
        alphabetButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс к нажатой кнопке
        this.classList.add('active');
        
        const letter = this.getAttribute('data-letter');
        let visibleCount = 0;

        actorCards.forEach(card => {
            const actorName = card.getAttribute('data-name');
            
            if (letter === 'all') {
                card.classList.remove('hidden');
                card.style.display = 'block';
                visibleCount++;
            } else if (actorName.charAt(0) === letter) {
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
            actorsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            actorsGrid.style.display = 'grid';
        }

        // Очистить поиск при выборе буквы
        if (actorSearchInput) {
            actorSearchInput.value = '';
        }
    });
});

// === SORT FUNCTIONALITY ===
const sortButtons = document.querySelectorAll('.sort-btn');

sortButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем активный класс со всех кнопок
        sortButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем активный класс к нажатой кнопке
        this.classList.add('active');
        
        const sortType = this.getAttribute('data-sort');
        const cardsArray = Array.from(actorCards);
        
        if (sortType === 'name') {
            // Сортировка по имени (А-Я)
            cardsArray.sort((a, b) => {
                const nameA = a.getAttribute('data-name');
                const nameB = b.getAttribute('data-name');
                return nameA.localeCompare(nameB, 'ru');
            });
        } else if (sortType === 'popular') {
            // Сортировка по популярности (можно добавить data-popular атрибут)
            // Пока просто перемешиваем
            cardsArray.sort(() => Math.random() - 0.5);
        }
        
        // Перестраиваем сетку
        actorsGrid.innerHTML = '';
        cardsArray.forEach(card => {
            actorsGrid.appendChild(card);
        });
    });
});

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
actorCards.forEach(card => {
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
        if (actorSearchInput) {
            actorSearchInput.focus();
        }
    }
});

// === RESET FILTERS ===
function resetFilters() {
    // Сброс поиска
    if (actorSearchInput) {
        actorSearchInput.value = '';
    }
    
    // Сброс алфавита
    alphabetButtons.forEach(btn => {
        if (btn.getAttribute('data-letter') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Показать все карточки
    actorCards.forEach(card => {
        card.classList.remove('hidden');
        card.style.display = 'block';
    });
    
    // Скрыть сообщение "ничего не найдено"
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    if (actorsGrid) {
        actorsGrid.style.display = 'grid';
    }
}

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
if (actorSearchInput) {
    const debouncedSearch = debounce(function(searchTerm) {
        let visibleCount = 0;

        actorCards.forEach(card => {
            const actorName = card.getAttribute('data-name');
            
            if (actorName.includes(searchTerm.toLowerCase())) {
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
            actorsGrid.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            actorsGrid.style.display = 'grid';
        }
    }, 300);

    actorSearchInput.addEventListener('input', function() {
        debouncedSearch(this.value.trim());
    });
}

console.log('Actors page initialized!');