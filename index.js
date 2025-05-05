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
    
    // Set current year in footer
    const footerYearElement = document.getElementById('footer-year');
    if (footerYearElement) {
        footerYearElement.textContent = new Date().getFullYear();
    }
});

// Main Carousel Variables
let currentSlide = 0;
const totalSlides = 6;
let carouselInterval;

function initMainCarousel() {
    // Set initial slide - hide all slides first
    document.querySelectorAll('.carousel-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the first slide
    document.querySelector(`.carousel-item:nth-child(${currentSlide + 1})`).classList.add('active');
    document.getElementById('current-slide').textContent = currentSlide + 1;
    
    // Add click handlers for the navigation buttons
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
        });
        
        nextButton.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
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
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }, 5000);
}

function updateSlide() {
    document.querySelectorAll('.carousel-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.carousel-item:nth-child(${currentSlide + 1})`).classList.add('active');
    document.getElementById('current-slide').textContent = currentSlide + 1;
}

// Resources Carousel Variables
let resourceCurrentSlide = 0;
let resourceTotalSlides = 0;
let resourceCardsPerSlide = 3;
let resourceCarouselContainer = null;
let resourceDots = [];

function initResourceCarousel() {
    resourceCarouselContainer = document.getElementById('resource-carousel');
    if (!resourceCarouselContainer) return;
    
    const resourceCards = resourceCarouselContainer.querySelectorAll('.resource-card');
    if (resourceCards.length === 0) return;
    
    // Determine initial cards per slide based on viewport width
    updateResourceCardsPerSlide();
    
    // Calculate total slides needed
    resourceTotalSlides = Math.ceil(resourceCards.length / resourceCardsPerSlide);
    
    // Create or update dots based on total slides
    updateDots();
    
    // Add event listeners to navigation buttons
    const prevBtn = document.querySelector('.resources-carousel .carousel-prev');
    const nextBtn = document.querySelector('.resources-carousel .carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            // Prevent default anchor behavior if it's an anchor
            if (e && e.preventDefault) e.preventDefault();
            resourceCurrentSlide = (resourceCurrentSlide - 1 + resourceTotalSlides) % resourceTotalSlides;
            showResourceSlide(resourceCurrentSlide);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            // Prevent default anchor behavior if it's an anchor
            if (e && e.preventDefault) e.preventDefault();
            resourceCurrentSlide = (resourceCurrentSlide + 1) % resourceTotalSlides;
            showResourceSlide(resourceCurrentSlide);
        });
    }
    
    // Initial slide display
    showResourceSlide(0);
    
    // Add window resize event listener
    window.addEventListener('resize', function() {
        const oldCardsPerSlide = resourceCardsPerSlide;
        updateResourceCardsPerSlide();
        
        // Only update if the layout changed
        if (oldCardsPerSlide !== resourceCardsPerSlide) {
            // Recalculate total slides
            resourceTotalSlides = Math.ceil(resourceCards.length / resourceCardsPerSlide);
            
            // Reset to first slide
            resourceCurrentSlide = 0;
            
            // Update dots based on new layout
            updateDots();
            
            // Show first slide
            showResourceSlide(0);
        }
    });
}

// Update how many cards to show per slide based on screen size
function updateResourceCardsPerSlide() {
    if (window.innerWidth < 768) {
        resourceCardsPerSlide = 1; // Mobile: 1 card per slide
    } else if (window.innerWidth < 992) {
        resourceCardsPerSlide = 2; // Tablet: 2 cards per slide
    } else {
        resourceCardsPerSlide = 3; // Desktop: 3 cards per slide
    }
}

// Create or update dots based on total slides
function updateDots() {
    const dotsContainer = document.querySelector('.carousel-dots');
    if (!dotsContainer) return;
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    resourceDots = [];
    
    // Create new dots based on total slides
    for (let i = 0; i < resourceTotalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-slide', i);
        
        // Add click event to each dot
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showResourceSlide(slideIndex);
        });
        
        dotsContainer.appendChild(dot);
        resourceDots.push(dot);
    }
    
    // Apply mobile-specific styles to dots container if needed
    if (window.innerWidth < 768) {
        dotsContainer.style.display = 'flex';
        dotsContainer.style.flexWrap = 'wrap';
        dotsContainer.style.gap = '8px';
        dotsContainer.style.justifyContent = 'center';
        dotsContainer.style.marginTop = '20px';
    } else {
        dotsContainer.style.display = '';
        dotsContainer.style.flexWrap = '';
        dotsContainer.style.gap = '';
        dotsContainer.style.justifyContent = '';
        dotsContainer.style.marginTop = '';
    }
}

function showResourceSlide(slideIndex) {
    resourceCurrentSlide = slideIndex;
    
    // Update active dot
    resourceDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === slideIndex);
    });
    
    // Calculate position for the slide
    const translateValue = -slideIndex * (100 / resourceCardsPerSlide) * resourceCardsPerSlide;
    resourceCarouselContainer.style.transform = `translateX(${translateValue}%)`;
    
    // For mobile view, adjust card widths to ensure they take full width
    const resourceCards = resourceCarouselContainer.querySelectorAll('.resource-card');
    
    resourceCards.forEach(card => {
        if (window.innerWidth < 768) {
            // On mobile, make cards take full width
            card.style.flex = '0 0 100%';
            card.style.minWidth = '80%';
            card.style.maxWidth = '100%';
        } else {
            // On desktop, restore original styling
            card.style.flex = '';
            card.style.minWidth = '';
            card.style.maxWidth = '';
        }
    });
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
                
                // Optionally stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // trigger when 10% of the element is visible
        rootMargin: '0px'
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Video player functionality
function playVideo() {
    const videoPlayButton = document.getElementById('video-play-button');
    const thumbnailImage = document.getElementById('thumbnail-image');
    const youtubeContainer = document.getElementById('youtube-container');
    
    if (videoPlayButton && thumbnailImage && youtubeContainer) {
        // Hide thumbnail and play button
        thumbnailImage.style.display = 'none';
        videoPlayButton.style.display = 'none';
        
        // Show video container
        youtubeContainer.style.display = 'block';
        
        // Create and append iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/rH6zdzitLEI?autoplay=1';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'autoplay');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        
        youtubeContainer.appendChild(iframe);
    }
}
