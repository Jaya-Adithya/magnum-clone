// Initialize all components when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing components");
    
    // Initialize carousels and interactive elements
    initMainCarousel();
    initResourceCarousel();
    initPricingTabs();
    initMobileMenu();
    
    // Initialize animations with a small delay to ensure DOM is fully ready
    setTimeout(function() {
        initScrollAnimations();
        console.log("Scroll animations initialized");
    }, 100);
});

// Main Carousel Variables
let currentSlide = 1;
const totalSlides = 6;
let carouselInterval;

function initMainCarousel() {
    // Set initial slide - hide all slides first
    document.querySelectorAll('.carousel-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the first slide
    document.querySelector(`.carousel-item:nth-child(${currentSlide})`).classList.add('active');
    document.getElementById('current-slide').textContent = currentSlide;
    
    // Add click handlers for the navigation buttons
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            moveCarousel(-1);
            // Reset the auto-rotation timer when manually navigated
            resetCarouselTimer();
        });
        
        nextButton.addEventListener('click', function() {
            moveCarousel(1);
            // Reset the auto-rotation timer when manually navigated
            resetCarouselTimer();
        });
    }
    
    // Start automatic carousel rotation
    startCarouselTimer();
    
    // Handle responsive layout changes
    window.addEventListener('resize', adjustCarouselLayout);
    adjustCarouselLayout();
}

function adjustCarouselLayout() {
    const isMobile = window.innerWidth < 768;
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    carouselItems.forEach(item => {
        if (isMobile) {
            // Stack image and text vertically on mobile
            item.style.flexDirection = 'column';
            
            // Center both elements
            const personContainer = item.querySelector('.person-image-container');
            const thoughtContainer = item.querySelector('.thought-bubble-container');
            
            if (personContainer) personContainer.style.textAlign = 'center';
            if (thoughtContainer) thoughtContainer.style.textAlign = 'center';
        } else {
            // Restore default layout for larger screens
            item.style.flexDirection = '';
            
            const personContainer = item.querySelector('.person-image-container');
            const thoughtContainer = item.querySelector('.thought-bubble-container');
            
            if (personContainer) personContainer.style.textAlign = '';
            if (thoughtContainer) thoughtContainer.style.textAlign = '';
        }
    });
}

function startCarouselTimer() {
    // Auto-rotate every 5 seconds
    carouselInterval = setInterval(function() {
        moveCarousel(1);
    }, 5000);
}

function resetCarouselTimer() {
    // Clear existing timer
    clearInterval(carouselInterval);
    // Start a new timer
    startCarouselTimer();
}

function moveCarousel(step) {
    // Hide current slide
    document.querySelector(`.carousel-item:nth-child(${currentSlide})`).classList.remove('active');
    
    // Calculate new slide number
    currentSlide = currentSlide + step;
    
    // Loop back to beginning/end if needed
    if (currentSlide > totalSlides) currentSlide = 1;
    if (currentSlide < 1) currentSlide = totalSlides;
    
    // Show new slide
    document.querySelector(`.carousel-item:nth-child(${currentSlide})`).classList.add('active');
    
    // Update slide counter
    document.getElementById('current-slide').textContent = currentSlide;
}

// Resources Carousel Variables
let resourceCurrentSlide = 0;
let resourceTotalSlides = 0;
let resourceCardsPerSlide = 3;
let resourceCarouselContainer = null;
let resourceCarouselWidth = 0;
let resourceDots = [];

function initResourceCarousel() {
    resourceCarouselContainer = document.getElementById('resource-carousel');
    if (!resourceCarouselContainer) return;
    
    const resourceCards = resourceCarouselContainer.querySelectorAll('.resource-card');
    resourceTotalSlides = Math.ceil(resourceCards.length / resourceCardsPerSlide);
    
    // Get all dots
    resourceDots = document.querySelectorAll('.carousel-dot');
    
    // Add event listeners to dots
    resourceDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showResourceSlide(parseInt(this.getAttribute('data-slide')));
        });
    });
    
    // Add event listeners to navigation buttons
    const prevBtn = document.querySelector('.resources-carousel .carousel-prev');
    const nextBtn = document.querySelector('.resources-carousel .carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            moveResourceCarousel(-1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            moveResourceCarousel(1);
        });
    }
    
    // Update carousel width and card width based on viewport
    updateResourceCarouselDimensions();
    
    // Add window resize event listener
    window.addEventListener('resize', function() {
        updateResourceCarouselDimensions();
        showResourceSlide(resourceCurrentSlide);
    });
}

function updateResourceCarouselDimensions() {
    // Determine cards per slide based on viewport width
    if (window.innerWidth < 768) {
        resourceCardsPerSlide = 1;
    } else if (window.innerWidth < 992) {
        resourceCardsPerSlide = 2;
    } else {
        resourceCardsPerSlide = 3;
    }
    
    // Recalculate total slides
    const resourceCards = resourceCarouselContainer.querySelectorAll('.resource-card');
    resourceTotalSlides = Math.ceil(resourceCards.length / resourceCardsPerSlide);
    
    // Get container width
    const carouselContainer = document.querySelector('.resources-carousel');
    resourceCarouselWidth = carouselContainer.offsetWidth;
}

function moveResourceCarousel(step) {
    resourceCurrentSlide += step;
    
    // Handle wrap-around
    if (resourceCurrentSlide < 0) resourceCurrentSlide = resourceTotalSlides - 1;
    if (resourceCurrentSlide >= resourceTotalSlides) resourceCurrentSlide = 0;
    
    showResourceSlide(resourceCurrentSlide);
}

function showResourceSlide(slideIndex) {
    resourceCurrentSlide = slideIndex;
    
    // Calculate translation amount
    const cardWidth = document.querySelector('.resource-card').offsetWidth + 40; // width + margin
    const translateValue = -1 * resourceCurrentSlide * cardWidth * resourceCardsPerSlide;
    
    // Apply transformation
    resourceCarouselContainer.style.transform = `translateX(${translateValue}px)`;
    
    // Update dots
    for (let i = 0; i < resourceDots.length; i++) {
        resourceDots[i].classList.remove('active');
    }
    
    if (resourceDots[resourceCurrentSlide]) {
        resourceDots[resourceCurrentSlide].classList.add('active');
    }
}

// Handle pricing tab switching
function initPricingTabs() {
    const tabs = document.querySelectorAll('.plan-tab');
    const feeBasedPlans = document.querySelector('.fee-based-plans');
    const depositBasedPlans = document.querySelector('.deposit-based-plans');
    
    if (tabs.length && feeBasedPlans && depositBasedPlans) {
        // Initialize - show fee-based plans by default
        feeBasedPlans.style.display = 'flex';
        depositBasedPlans.style.display = 'none';
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Toggle the appropriate plans based on selected tab
                if (index === 0) {
                    // Fee Based Credit (first tab)
                    feeBasedPlans.style.display = 'flex';
                    depositBasedPlans.style.display = 'none';
                    console.log("Switched to Fee Based Credit plans");
                } else {
                    // Free with Deposit (second tab)
                    feeBasedPlans.style.display = 'none';
                    depositBasedPlans.style.display = 'flex';
                    console.log("Switched to Free with Deposit plans");
                }
            });
        });
    }
}

// Handle mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.navbar-toggler');
    const navMenu = document.querySelector('.navbar-collapse');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
}

// Initialize scroll-based animations
function initScrollAnimations() {
    // Select elements with animation classes
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add animation class when element enters viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Optional: Stop observing after animation is triggered
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove animation class when element leaves viewport
                // Uncomment if you want to replay animations when scrolling up
                // entry.target.classList.remove('animate');
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% of the element is visible
        rootMargin: '0px 0px -100px 0px' // trigger slightly before element enters viewport
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Set data attributes on elements to mark them for animation
    animatedElements.forEach(element => {
        element.setAttribute('data-scroll-animated', 'true');
    });
}

// Video player functionality
// This function is called from the HTML inline onclick
function playVideo() {
    // Get the elements
    const thumbnailImage = document.getElementById('thumbnail-image');
    const playButton = document.getElementById('video-play-button');
    const youtubeContainer = document.getElementById('youtube-container');
    
    if (!thumbnailImage || !playButton || !youtubeContainer) {
        console.error('Missing video elements');
        return;
    }
    
    // Create the iframe element
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/rH6zdzitLEI?autoplay=1';
    iframe.title = 'Credit Importance Video';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.width = '100%';
    iframe.height = '100%';
    
    // Insert iframe and hide thumbnail
    youtubeContainer.innerHTML = '';
    youtubeContainer.appendChild(iframe);
    youtubeContainer.style.display = 'block';
    thumbnailImage.style.display = 'none';
    playButton.style.display = 'none';
} 

currentYear = new Date().getFullYear();
document.getElementById("footer-year").textContent = currentYear;
