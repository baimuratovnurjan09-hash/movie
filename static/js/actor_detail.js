// === FAVORITE ACTOR BUTTON ===
const favoriteActorBtn = document.getElementById('favoriteActorBtn');

if (favoriteActorBtn) {
    // Получаем slug актера из URL
    const actorSlug = window.location.pathname.split('/').filter(Boolean).pop();
    const favoriteActors = JSON.parse(localStorage.getItem('favoriteActors') || '[]');
    
    // Проверяем, есть ли актер в избранном
    if (favoriteActors.includes(actorSlug)) {
        favoriteActorBtn.classList.add('active');
        favoriteActorBtn.querySelector('svg path').setAttribute('fill', 'white');
    }

    favoriteActorBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const svg = this.querySelector('svg path');
        
        if (this.classList.contains('active')) {
            svg.setAttribute('fill', 'white');
            addToFavoriteActors(actorSlug);
            showNotification('✓ Актер добавлен в избранное');
        } else {
            svg.setAttribute('fill', 'none');
            removeFromFavoriteActors(actorSlug);
            showNotification('Актер удален из избранного');
        }
    });
}

function addToFavoriteActors(actorSlug) {
    const favoriteActors = JSON.parse(localStorage.getItem('favoriteActors') || '[]');
    if (!favoriteActors.includes(actorSlug)) {
        favoriteActors.push(actorSlug);
        localStorage.setItem('favoriteActors', JSON.stringify(favoriteActors));
    }
}

function removeFromFavoriteActors(actorSlug) {
    let favoriteActors = JSON.parse(localStorage.getItem('favoriteActors') || '[]');
    favoriteActors = favoriteActors.filter(slug => slug !== actorSlug);
    localStorage.setItem('favoriteActors', JSON.stringify(favoriteActors));
}

// === SHARE BUTTON ===
const shareBtn = document.querySelector('.btn-share-actor');

if (shareBtn) {
    shareBtn.addEventListener('click', async function() {
        const actorName = document.querySelector('.actor-hero-name').textContent;
        const shareData = {
            title: actorName,
            text: `Посмотрите информацию об актере: ${actorName}`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                showNotification('✓ Ссылка успешно отправлена');
            } else {
                await navigator.clipboard.writeText(window.location.href);
                showNotification('✓ Ссылка скопирована в буфер обмена');
            }
        } catch (err) {
            console.error('Ошибка при попытке поделиться:', err);
        }
    });
}

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

// === SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Анимация секций
const sections = document.querySelectorAll('.biography-section, .filmography-section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
});

// === BIOGRAPHY READ MORE ===
const biographyText = document.querySelector('.biography-text');

if (biographyText && biographyText.scrollHeight > 300) {
    const readMoreBtn = document.createElement('button');
    readMoreBtn.className = 'read-more-btn';
    readMoreBtn.innerHTML = 'Читать полностью';
    readMoreBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 24px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    biographyText.style.maxHeight = '300px';
    biographyText.style.overflow = 'hidden';
    biographyText.style.position = 'relative';
    
    const gradient = document.createElement('div');
    gradient.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        background: linear-gradient(transparent, var(--dark-bg));
        pointer-events: none;
    `;
    biographyText.style.position = 'relative';
    biographyText.appendChild(gradient);
    
    biographyText.parentElement.appendChild(readMoreBtn);
    
    readMoreBtn.addEventListener('click', function() {
        if (biographyText.style.maxHeight === '300px') {
            biographyText.style.maxHeight = 'none';
            gradient.style.display = 'none';
            this.textContent = 'Свернуть';
        } else {
            biographyText.style.maxHeight = '300px';
            gradient.style.display = 'block';
            this.textContent = 'Читать полностью';
            biographyText.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// === LAZY LOAD IMAGES ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => imageObserver.observe(img));
}

// === PARALLAX EFFECT ===
window.addEventListener('scroll', function() {
    const heroImage = document.querySelector('.actor-hero-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

console.log('Actor detail page initialized!');