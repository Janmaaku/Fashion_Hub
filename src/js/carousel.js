export let currentSlide = 0;
const totalSlides = 3;
let autoPlayInterval;

export function moveCarousel(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
}

export function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    document.getElementById('carouselContainer').style.transform = `translateX(-${currentSlide * 100}%)`;

    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });

    resetAutoPlay();
}

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
}

startAutoPlay();
