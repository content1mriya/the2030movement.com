document.addEventListener('DOMContentLoaded', () => {
    // 1. Слайдер курсов
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

    // 2. Success popup
    const successPopup = document.getElementById('successPopup');

    const showSuccess = () => {
        if (!successPopup) return;
        successPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeAllPopups = () => {
        document.querySelectorAll('.popup-overlay').forEach(p => p.classList.remove('active'));
        document.body.style.overflow = '';
    };

    document.querySelectorAll('.close-success, .close-success-btn').forEach(btn => {
        btn.addEventListener('click', closeAllPopups);
    });

    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) closeAllPopups();
        });
    }

    // 3. Показ success popup после возврата с submit.php
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status === 'success') {
        showSuccess();

        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }

    // 4. Popup формы курса
    const coursePopup = document.getElementById('contactPopup');
    if (coursePopup) {
        const openBtns = document.querySelectorAll('.open-popup');
        const closeBtn = document.querySelector('.close-popup');
        const popupTitle = document.getElementById('popupTitle');
        const selectedCourseInput = document.getElementById('selectedCourse');

        openBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const courseName = btn.getAttribute('data-course');

                if (popupTitle) {
                    popupTitle.innerText = `KURS: ${courseName}`;
                }

                if (selectedCourseInput) {
                    selectedCourseInput.value = courseName;
                }

                coursePopup.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closeAllPopups);
        }

        coursePopup.addEventListener('click', (e) => {
            if (e.target === coursePopup) closeAllPopups();
        });
    }

    // 5. Анимация появления
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 6. Плавный скролл по якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// 7. Мобильное меню
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.getElementById('nav-menu');

if (mobileMenu && navMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');

        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    document.querySelectorAll('.nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}
