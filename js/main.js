/* js/main.js */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==============================================
    // 1. OBSŁUGA GŁÓWNEJ KARUZELI (PORTFOLIO)
    // ==============================================
    const track = document.querySelector('.carousel-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');

        // Pobranie szerokości slajdu
        const slideWidth = slides[0].getBoundingClientRect().width;

        // Ustawienie slajdów obok siebie
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        }

        // Kliknięcie w prawo
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const nextSlide = currentSlide.nextElementSibling;
            if (nextSlide) {
                moveToSlide(track, currentSlide, nextSlide);
            }
        });

        // Kliknięcie w lewo
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            const prevSlide = currentSlide.previousElementSibling;
            if (prevSlide) {
                moveToSlide(track, currentSlide, prevSlide);
            }
        });

        // Obsługa zmiany wielkości okna (responsywność karuzeli)
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = newSlideWidth * index + 'px';
            });
        });
    }

    // ==============================================
    // 1.5 MINI KARUZELA (ZINTELIGENTNIONA - PAUZA POZA EKRANEM)
    // ==============================================
    const initMiniCarousel = (carouselId, intervalTime = 3500) => {
        const container = document.getElementById(carouselId);
        if (!container) return; // Jeśli karuzeli nie ma, przerwij (nie rób błędu)

        const slides = container.querySelectorAll('.mini-slide');
        const nextBtn = container.querySelector('.mini-next');
        const prevBtn = container.querySelector('.mini-prev');
        
        // Jeśli nie ma slajdów, też przerwij
        if (slides.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval = null;
        let isVisible = false; // Czy karuzela jest widoczna na ekranie?

        // Funkcja zmieniająca slajd
        const showSlide = (index) => {
            // Usuwamy klasę active z obecnego
            slides[currentIndex].classList.remove('active');
            
            // Obliczamy nowy indeks (zapętlenie)
            currentIndex = (index + slides.length) % slides.length;
            
            // Dodajemy klasę active nowemu
            slides[currentIndex].classList.add('active');
        };

        const nextSlide = () => showSlide(currentIndex + 1);
        const prevSlide = () => showSlide(currentIndex - 1);

        // --- OPTYMALIZACJA: Start/Stop tylko gdy potrzebne ---
        const startAutoPlay = () => {
            if (!autoPlayInterval) {
                autoPlayInterval = setInterval(nextSlide, intervalTime);
            }
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        };

        // --- OBSERVER: Sprawdza czy karuzela jest na ekranie ---
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible = true;
                    startAutoPlay(); // Włączamy, bo widać
                } else {
                    isVisible = false;
                    stopAutoPlay(); // Wyłączamy, żeby nie obciążać strony
                }
            });
        }, { threshold: 0.1 }); // Reaguj, gdy widać chociaż 10%

        observer.observe(container);

        // --- OBSŁUGA PRZYCISKÓW ---
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Żeby kliknięcie nie uruchamiało linków pod spodem
                stopAutoPlay(); // Pauza przy interakcji (żeby nie przeskoczyło pod palcem)
                nextSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                stopAutoPlay();
                prevSlide();
            });
        }
    };

    // ==============================================
    // !!! WAŻNE: TUTAJ URUCHAMIAMY KARUZELE !!!
    // ==============================================
    
    // 1. Wnętrza
    initMiniCarousel('carousel-wnetrza', 3500);
    
    // 2. Śluby
    initMiniCarousel('carousel-sluby', 4000);
    
    // 3. Dron (Jeśli istnieje w HTML)
    initMiniCarousel('carousel-dron', 3800);
    
    // 4. Produktowe (Jeśli istnieje w HTML)
    initMiniCarousel('carousel-produktowe', 4200);


    // ==============================================
    // 2. SYSTEM SPOTLIGHT (CINEMA MODE)
    // ==============================================
    const rows = document.querySelectorAll('.service-row');
    const body = document.body;
    const servicesSection = document.querySelector('.services-section');

    // Sprawdzamy czy to komputer (myszka) czy dotyk
    const hasMouse = window.matchMedia('(hover: hover)').matches;

    if (hasMouse) {
        // Logika dla komputerów
        rows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                body.classList.add('spotlight-mode');
                row.classList.add('active-row');
            });
            row.addEventListener('mouseleave', () => {
                body.classList.remove('spotlight-mode');
                row.classList.remove('active-row');
            });
        });
    } else {
        // Logika dla telefonów (Scroll)
        const observerOptions = {
            root: null,
            rootMargin: '-45% 0px -45% 0px', 
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    body.classList.add('spotlight-mode');
                    rows.forEach(r => r.classList.remove('active-row'));
                    entry.target.classList.add('active-row');
                }
            });
        }, observerOptions);

        rows.forEach(row => observer.observe(row));

        // Wyłączanie trybu po wyjechaniu z sekcji
        const sectionObserver = new IntersectionObserver((entries) => {
            if (!entries[0].isIntersecting) {
                body.classList.remove('spotlight-mode');
                rows.forEach(r => r.classList.remove('active-row'));
            }
        });
        
        if(servicesSection) sectionObserver.observe(servicesSection);
    }
    
    // ==============================================
    // 3. INK / GEOMETRIC REVEAL (Odsłanianie sekcji)
    // ==============================================
    const revealRows = document.querySelectorAll('.service-row');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Animacja startuje, gdy 15% elementu jest widoczne
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const row = entry.target;
                
                // 1. Dodaj klasę, która uruchamia animację CSS (clip-path rośnie)
                row.classList.add('ink-active');

                // 2. Po zakończeniu animacji (1.2s) usuń maskę, żeby przywrócić cienie (box-shadow)
                setTimeout(() => {
                    row.classList.add('ink-finished');
                }, 1200);

                // Przestań obserwować ten element (animacja jednorazowa)
                observer.unobserve(row);
            }
        });
    }, revealObserverOptions);

    // Rozpocznij obserwację każdego wiersza usług
    revealRows.forEach(row => {
        revealObserver.observe(row);
    });

});