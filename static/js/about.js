// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за всеми секциями
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Эффект параллакса для hero секции
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < 300) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Анимация счетчиков статистики
const animateCounter = (element, target) => {
    const duration = 2000; // 2 секунды
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
};

// Форматирование чисел (добавляет K+ или запятые)
const formatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
};

// Запуск анимации счетчиков при появлении в области видимости
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statCards = entry.target.querySelectorAll('.stat-card');
            
            statCards.forEach((card, index) => {
                const numberElement = card.querySelector('.stat-number');
                const text = numberElement.textContent;
                
                // Извлекаем число из текста
                let targetNumber;
                if (text.includes('★')) {
                    return; // Пропускаем рейтинг
                } else if (text.includes('K+')) {
                    targetNumber = parseInt(text.replace('K+', '')) * 1000;
                } else if (text.includes('+')) {
                    targetNumber = parseInt(text.replace('+', ''));
                } else {
                    targetNumber = parseInt(text);
                }
                
                setTimeout(() => {
                    animateCounter(numberElement, targetNumber);
                }, index * 200); // Задержка между анимациями
            });
        }
    });
}, { threshold: 0.5 });

// Наблюдаем за секцией со статистикой
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection.parentElement);
}

// Добавление интерактивности к карточкам команды
document.querySelectorAll('.team-member').forEach(member => {
    member.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    member.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Добавление эффекта ripple при клике на карточки
document.querySelectorAll('.feature-card, .stat-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// CSS для ripple эффекта (добавляется динамически)
const style = document.createElement('style');
style.textContent = `
    .feature-card, .stat-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(229, 9, 20, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);