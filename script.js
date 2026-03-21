document.addEventListener('DOMContentLoaded', () => {
    
    // 1. СЛАЙДЕР КУРСІВ
    const track = document.getElementById('coursesTrack');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (track && nextBtn && prevBtn) {
        const totalSlides = 3; 
        let currentIndex = 0;
        const updateSlider = () => {
            const offset = -(currentIndex * (100 / totalSlides));
            track.style.transform = `translateX(${offset}%)`;
        };
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
    }

    // 2. ФУНКЦІЇ ДЛЯ SUCCESS POP-UP
    const successPopup = document.getElementById('successPopup');
    
    const showSuccess = () => {
        successPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllPopups = () => {
        document.querySelectorAll('.popup-overlay').forEach(p => p.classList.remove('active'));
        document.body.style.overflow = '';
    };

    // Закриття Success Pop-up при кліку на кнопки або фон
    document.querySelectorAll('.close-success, .close-success-btn').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });
    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) closeAllPopups();
        });
    }

    // 3. ОБРОБКА ФОРМ
    const handleFormSubmit = (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                this.reset(); // Очищуємо поля
                showSuccess(); // Показуємо наш гарний попап замість alert
            });
        }
    };

    handleFormSubmit('mainContactForm');
    handleFormSubmit('popupForm');

    // 4. ЛОГІКА ВІДКРИТТЯ ПОПАПУ КУРСІВ
    const coursePopup = document.getElementById('contactPopup');
    if (coursePopup) {
        const openBtns = document.querySelectorAll('.open-popup');
        const closeBtn = document.querySelector('.close-popup');
        const popupTitle = document.getElementById('popupTitle');
        const selectedCourseInput = document.getElementById('selectedCourse');

        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const courseName = btn.getAttribute('data-course');
                if (popupTitle) popupTitle.innerText = `КУРС: ${courseName}`;
                if (selectedCourseInput) selectedCourseInput.value = courseName;
                coursePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', closeAllPopups);
        
        coursePopup.addEventListener('click', (e) => {
            if (e.target === coursePopup) closeAllPopups();
        });
    }

    // 5. АНІМАЦІЯ ПОЯВИ ТА ПЛАВНИЙ СКРОЛ
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Блокуємо прокрутку сторінки при відкритому меню
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Закриваємо меню при натисканні на посилання
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});