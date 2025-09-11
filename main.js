// main.js - DisasterAlert System - Enhanced Version (Final Fix)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with enhanced functionality
    initNewsTicker();
    initNavigation();
    initWeatherWidget();
    initEmergencyButton();
    initFAQAccordions();
    initForms();
    initAnimations();
    initDashboardComponents();
    initAlertFilters();
    initSubscriptionForms();
    initRegistrationForms();
    initSmoothScrolling();
    initCounters();
    initInteractiveMaps();
    initTestimonialSliders();
    
    // New enhanced initialization
    initServiceWorker();
    initPerformanceMonitoring();
    initOfflineFunctionality();
    initPushNotifications();
    initGeolocationFeatures();
});

// Enhanced News Ticker Functionality
function initNewsTicker() {
    const tickerWrapper = document.querySelector('.ticker-wrapper');
    const tickerContent = document.querySelector('.ticker-content');
    
    if (!tickerContent || !tickerWrapper) return;
    
    // Create a more advanced ticker with multiple news sources
    const newsSources = [
        { name: 'National Weather Service', priority: 1 },
        { name: 'Emergency Broadcast', priority: 1 },
        { name: 'Local Authorities', priority: 2 },
        { name: 'Community Reports', priority: 3 }
    ];
    
    // Add controls for ticker
    const tickerControls = document.createElement('div');
    tickerControls.className = 'ticker-controls';
    tickerControls.innerHTML = `
        <button class="ticker-pause" aria-label="Pause ticker">
            <i class="fas fa-pause"></i>
        </button>
        <button class="ticker-prev" aria-label="Previous news">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="ticker-next" aria-label="Next news">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    tickerWrapper.appendChild(tickerControls);
    
    // Duplicate content for seamless looping
    const originalContent = tickerContent.innerHTML;
    tickerContent.innerHTML = originalContent + originalContent;
    
    // Enhanced animation with variable speed based on content length
    const tickerItems = tickerContent.querySelectorAll('.ticker-item');
    if (tickerItems.length > 0) {
        const contentWidth = tickerItems[0].offsetWidth * tickerItems.length;
        const duration = (contentWidth / 50) * 10; // px per second adjusted by content length
        
        tickerContent.style.animation = `ticker-scroll ${duration}s linear infinite`;
    
    // Add interaction controls
    const pauseBtn = tickerWrapper.querySelector('.ticker-pause');
    const prevBtn = tickerWrapper.querySelector('.ticker-prev');
    const nextBtn = tickerWrapper.querySelector('.ticker-next');
    
    let isPaused = false;
    
    pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        if (isPaused) {
            tickerContent.style.animationPlayState = 'paused';
            this.innerHTML = '<i class="fas fa-play"></i>';
            this.setAttribute('aria-label', 'Play ticker');
        } else {
            tickerContent.style.animationPlayState = 'running';
            this.innerHTML = '<i class="fas fa-pause"></i>';
            this.setAttribute('aria-label', 'Pause ticker');
        }
    });
    
    // Simulate fetching real news data
    fetchNewsData().then(newsItems => {
        if (newsItems && newsItems.length > 0) {
            updateTickerWithRealData(newsItems);
        }
    }).catch(error => {
        console.error('Failed to fetch news data:', error);
        // Fallback to default content
    });
    
    // Keyboard navigation
    tickerWrapper.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            simulatePrevButtonClick();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            simulateNextButtonClick();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            pauseBtn.click();
        }
    });
    
    // Touch swipe support for mobile
    let touchStartX = 0;
    tickerWrapper.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    tickerWrapper.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0) {
                simulatePrevButtonClick();
            } else {
                simulateNextButtonClick();
            }
        }
    }, {passive: true});
}

async function fetchNewsData() {
    try {
        // Use a mock API endpoint for development
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add cache control for fresh data
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // Transform data to match our format
        return data.map(item => ({
            id: item.id,
            title: item.title,
            priority: item.id % 3 === 0 ? 'high' : (item.id % 3 === 1 ? 'medium' : 'low'),
            timestamp: new Date(Date.now() - item.id * 3600000)
        }));
    } catch (error) {
        // Fallback to simulated data
        return [
            { id: 1, title: 'Severe weather warning issued for Northern regions', priority: 'high', timestamp: new Date() },
            { id: 2, title: 'Flood alert: River levels rising rapidly in coastal areas', priority: 'high', timestamp: new Date(Date.now() - 3600000) },
            { id: 3, title: 'Emergency services on high alert across multiple districts', priority: 'medium', timestamp: new Date(Date.now() - 7200000) }
        ];
    }
}

function updateTickerWithRealData(newsItems) {
    const tickerContent = document.querySelector('.ticker-content');
    if (!tickerContent) return;
    
    // Clear existing content
    tickerContent.innerHTML = '';
    
    // Add new items with priority indicators
    newsItems.forEach(item => {
        const tickerItem = document.createElement('div');
        tickerItem.className = `ticker-item priority-${item.priority}`;
        
        const timeAgo = getTimeAgo(item.timestamp);
        const priorityIcon = item.priority === 'high' ? '<i class="fas fa-exclamation-circle"></i>' : '';
        
        tickerItem.innerHTML = `
            ${priorityIcon}
            <span class="ticker-text">${item.title}</span>
            <span class="ticker-time">${timeAgo}</span>
        `;
        
        tickerContent.appendChild(tickerItem);
    });
    
    // Duplicate for seamless loop
    const originalContent = tickerContent.innerHTML;
    tickerContent.innerHTML += originalContent;
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Enhanced Navigation Menu
function initNavigation() {
    const nav = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (!nav) return;
    
    // Add accessibility attributes
    nav.setAttribute('aria-label', 'Main navigation');
    
    navLinks.forEach(link => {
        // Set aria-current for current page
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === 'index.html' && linkPage === '/')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
        
        // Enhanced smooth scrolling with offset for fixed header
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                    
                    // Focus the target for accessibility
                    setTimeout(() => {
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                    }, 1000);
                }
            }
        });
    });
    
    // Enhanced mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.setAttribute('aria-label', 'Toggle menu');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            nav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Trap focus in mobile menu when open
            if (nav.classList.contains('active')) {
                trapFocus(nav);
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !e.target.closest('.nav-list') && 
            !e.target.closest('.menu-toggle')) {
            nav.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Keyboard navigation for menu
    nav.addEventListener('keydown', function(e) {
        const links = this.querySelectorAll('a');
        const firstLink = links[0];
        const lastLink = links[links.length - 1];
        
        if (e.key === 'Escape') {
            if (menuToggle) {
                menuToggle.click();
                menuToggle.focus();
            }
        } else if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstLink) {
                e.preventDefault();
                lastLink.focus();
            } else if (!e.shiftKey && document.activeElement === lastLink) {
                e.preventDefault();
                firstLink.focus();
            }
        }
    });
    
    // Add visual indicator for current scroll position
    window.addEventListener('scroll', debounce(highlightCurrentSection, 100));
}

function trapFocus(element) {
    const focusableElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
    
    firstFocusable.focus();
}

function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id], main[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    const scrollPosition = window.scrollY + 100;
    
    // Reset all active states
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Find current section
    let currentSectionId = '';
    
    for (const section of sections) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
            break;
        }
    }
    
    // Set active state for current section
    if (currentSectionId) {
        const currentLink = document.querySelector(`.nav-list a[href="#${currentSectionId}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
            currentLink.setAttribute('aria-current', 'page');
        }
    }
}

// Enhanced Weather Widget
function initWeatherWidget() {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget) return;
    
    // Add loading state
    weatherWidget.innerHTML = `
        <div class="weather-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading weather...</span>
        </div>
    `;
    
    // Get user location for personalized weather
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            error => {
                // Fallback to default location
                console.warn('Geolocation failed, using default location:', error);
                fetchWeatherData(40.7128, -74.0060); // New York default
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 300000 // 5 minutes
            }
        );
    } else {
        // Geolocation not supported
        fetchWeatherData(40.7128, -74.0060);
    }
}

async function fetchWeatherData(lat, lon) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget) return;
    
    try {
        // Use Open-Meteo API as a reliable fallback
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const weatherData = await response.json();
        const current = weatherData.current;
        
        // Transform API data to our format
        const transformedData = {
            temp: Math.round(current.temperature_2m),
            condition: getWeatherConditionName(current.weather_code),
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            location: 'Current Location'
        };
        
        updateWeatherWidget(transformedData);
        
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Fallback to simulated data
        const simulatedData = {
            temp: Math.floor(Math.random() * 15) + 15,
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            location: 'Current Location'
        };
        updateWeatherWidget(simulatedData);
    }
}

function getWeatherConditionName(weatherCode) {
    // Convert WMO weather code to condition name
    const weatherMap = {
        0: 'Clear',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Drizzle',
        53: 'Drizzle',
        55: 'Drizzle',
        56: 'Freezing Drizzle',
        57: 'Freezing Drizzle',
        61: 'Rainy',
        63: 'Rainy',
        65: 'Rainy',
        66: 'Freezing Rain',
        67: 'Freezing Rain',
        71: 'Snow',
        73: 'Snow',
        75: 'Snow',
        77: 'Snow Grains',
        80: 'Rainy',
        81: 'Rainy',
        82: 'Rainy',
        85: 'Snow',
        86: 'Snow',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Thunderstorm'
    };
    
    return weatherMap[weatherCode] || 'Unknown';
}

function updateWeatherWidget(data) {
    const weatherWidget = document.querySelector('.weather-widget');
    if (!weatherWidget) return;
    
    const conditionIcon = getWeatherIcon(data.condition);
    const alertClass = shouldAlertWeather(data.condition) ? 'weather-alert' : '';
    
    weatherWidget.innerHTML = `
        <div class="weather-content ${alertClass}">
            <div class="weather-main">
                <i class="fas fa-${conditionIcon}"></i>
                <div class="weather-temp">${data.temp}°C</div>
            </div>
            <div class="weather-details">
                <div class="weather-condition">${data.condition}</div>
                <div class="weather-location">${data.location}</div>
                <div class="weather-stats">
                    <span><i class="fas fa-tint"></i> ${data.humidity}%</span>
                    <span><i class="fas fa-wind"></i> ${data.windSpeed} km/h</span>
                </div>
            </div>
            ${alertClass ? '<div class="weather-warning"><i class="fas fa-exclamation-triangle"></i> Severe weather alert</div>' : ''}
        </div>
    `;
    
    // Add click to refresh functionality
    weatherWidget.addEventListener('click', function() {
        this.innerHTML = `
            <div class="weather-loading">
                <i class="fas fa-sync-alt fa-spin"></i>
                <span>Updating weather...</span>
            </div>
        `;
        initWeatherWidget(); // Reinitialize
    });
    
    // Add tooltip with last updated time
    weatherWidget.setAttribute('title', `Last updated: ${new Date().toLocaleTimeString()}`);
}

function getWeatherIcon(condition) {
    const iconMap = {
        'Sunny': 'sun',
        'Cloudy': 'cloud',
        'Rainy': 'cloud-rain',
        'Clear': 'sun',
        'Stormy': 'bolt',
        'Snow': 'snowflake',
        'Thunderstorm': 'bolt',
        'Drizzle': 'cloud-rain',
        'Foggy': 'smog',
        'Overcast': 'cloud',
        'Mainly Clear': 'sun',
        'Partly Cloudy': 'cloud-sun',
        'Freezing Drizzle': 'temperature-low',
        'Freezing Rain': 'icicles',
        'Snow Grains': 'snowflake'
    };
    return iconMap[condition] || 'cloud';
}

function shouldAlertWeather(condition) {
    const alertConditions = ['Stormy', 'Rainy', 'Snow', 'Thunderstorm', 'Freezing Rain', 'Freezing Drizzle'];
    return alertConditions.includes(condition);
}

// Enhanced Emergency Button
function initEmergencyButton() {
    const emergencyBtn = document.querySelector('.emergency-button');
    if (!emergencyBtn) return;
    
    // Add accessibility features
    emergencyBtn.setAttribute('aria-label', 'Emergency assistance');
    emergencyBtn.setAttribute('role', 'button');
    
    // Add long-press functionality for emergency
    let pressTimer;
    let isLongPress = false;
    
    emergencyBtn.addEventListener('mousedown', startPressTimer);
    emergencyBtn.addEventListener('touchstart', startPressTimer);
    
    emergencyBtn.addEventListener('mouseup', cancelPressTimer);
    emergencyBtn.addEventListener('touchend', cancelPressTimer);
    emergencyBtn.addEventListener('mouseleave', cancelPressTimer);
    
    emergencyBtn.addEventListener('click', function(e) {
        if (!isLongPress) { // Regular click
            handleEmergencyRequest();
        }
        isLongPress = false;
    });
    
    function startPressTimer() {
        isLongPress = false;
        pressTimer = setTimeout(function() {
            isLongPress = true;
            handleEmergencySOS();
        }, 2000); // 2 second hold for SOS
    }
    
    function cancelPressTimer() {
        clearTimeout(pressTimer);
    }
    
    // Add shake detection for emergency (with fallback for deprecated API)
    let shakeTimer;
    let lastShakeTime = 0;
    
    // Use newer Generic Sensor API if available, with fallback to devicemotion
    if ('LinearAccelerationSensor' in window) {
        try {
            const sensor = new LinearAccelerationSensor({ frequency: 10 });
            sensor.addEventListener('reading', () => {
                checkForShake(sensor.x, sensor.y, sensor.z);
            });
            sensor.start();
        } catch (error) {
            console.error('LinearAccelerationSensor not available:', error);
            setupLegacyShakeDetection();
        }
    } else {
        setupLegacyShakeDetection();
    }
    
    function setupLegacyShakeDetection() {
        if (window.DeviceMotionEvent) {
            console.warn('DeviceMotionEvent is deprecated. Please use the Generic Sensor API.');
            
            let lastAcceleration = { x: null, y: null, z: null };
            
            window.addEventListener('devicemotion', function(e) {
                const acceleration = e.accelerationIncludingGravity;
                
                if (!lastAcceleration.x) {
                    lastAcceleration = {
                        x: acceleration.x,
                        y: acceleration.y,
                        z: acceleration.z
                    };
                    return;
                }
                
                const deltaX = Math.abs(acceleration.x - lastAcceleration.x);
                const deltaY = Math.abs(acceleration.y - lastAcceleration.y);
                const deltaZ = Math.abs(acceleration.z - lastAcceleration.z);
                
                if ((deltaX > 15 && deltaY > 15) || 
                    (deltaX > 15 && deltaZ > 15) || 
                    (deltaY > 15 && deltaZ > 15)) {
                    
                    const currentTime = new Date().getTime();
                    if (currentTime - lastShakeTime > 1000) { // Prevent multiple triggers
                        lastShakeTime = currentTime;
                        handleEmergencyShake();
                    }
                }
                
                lastAcceleration = {
                    x: acceleration.x,
                    y: acceleration.y,
                    z: acceleration.z
                };
            });
        }
    }
    
    function checkForShake(x, y, z) {
        // Simple shake detection for new API
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        if (acceleration > 20) { // Threshold for shake detection
            const currentTime = new Date().getTime();
            if (currentTime - lastShakeTime > 1000) {
                lastShakeTime = currentTime;
                handleEmergencyShake();
            }
        }
    }
}

function handleEmergencyRequest() {
    // Show confirmation modal with more options
    const modal = createEmergencyModal();
    document.body.appendChild(modal);
    
    // Add emergency sound
    playEmergencySound();
    
    // Start location tracking
    startEmergencyLocationTracking();
}

function handleEmergencySOS() {
    // Immediate emergency response without confirmation
    alert('SOS ACTIVATED! Emergency services have been notified with your location.');
    
    // Send emergency signal with location
    sendEmergencySignal('SOS_ACTIVATED');
    
    // Flash screen and make sound
    flashEmergencyAlert();
}

function handleEmergencyShake() {
    // Shake to activate emergency
    const confirmed = confirm('Shake detected! Activate emergency mode?');
    if (confirmed) {
        handleEmergencyRequest();
    }
}

function createEmergencyModal() {
    const modal = document.createElement('div');
    modal.className = 'emergency-modal';
    modal.innerHTML = `
        <div class="emergency-modal-content">
            <h2><i class="fas fa-exclamation-triangle"></i> Emergency Assistance</h2>
            <p>What type of emergency are you experiencing?</p>
            <div class="emergency-options">
                <button class="emergency-option medical">
                    <i class="fas fa-plus-square"></i>
                    <span>Medical Emergency</span>
                </button>
                <button class="emergency-option fire">
                    <i class="fas fa-fire"></i>
                    <span>Fire Emergency</span>
                </button>
                <button class="emergency-option police">
                    <i class="fas fa-shield-alt"></i>
                    <span>Police Assistance</span>
                </button>
                <button class="emergency-option other">
                    <i class="fas fa-question-circle"></i>
                    <span>Other Emergency</span>
                </button>
            </div>
            <div class="emergency-actions">
                <button class="cancel-emergency">Cancel</button>
                <button class="confirm-emergency">Call for Help</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.cancel-emergency').addEventListener('click', function() {
        document.body.removeChild(modal);
        stopEmergencySound();
    });
    
    modal.querySelector('.confirm-emergency').addEventListener('click', function() {
        // Get selected emergency type
        const selected = modal.querySelector('.emergency-option.selected');
        const emergencyType = selected ? selected.classList[1] : 'general';
        
        // Trigger emergency response
        triggerEmergencyResponse(emergencyType);
        document.body.removeChild(modal);
    });
    
    // Select emergency type
    modal.querySelectorAll('.emergency-option').forEach(option => {
        option.addEventListener('click', function() {
            modal.querySelectorAll('.emergency-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    return modal;
}

function triggerEmergencyResponse(type) {
    // In a real implementation, this would contact emergency services
    alert(`Emergency assistance requested for ${type} emergency! Help is on the way.`);
    
    // Redirect to emergency call
    window.location.href = 'tel:911';
}

// Enhanced FAQ Accordions
function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Add accessibility attributes
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answer.id || generateId('faq-answer'));
        
        if (!answer.id) {
            answer.id = question.getAttribute('aria-controls');
        }
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Toggle this item
            question.setAttribute('aria-expanded', !isExpanded);
            item.classList.toggle('active');
            
            // Close other items if this is opened (optional)
            if (!isExpanded && item.parentNode.classList.contains('faq-accordion')) {
                closeOtherFaqItems(item);
            }
            
            // Smooth height transition
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                navigateFaqItems(e.key, item);
            }
        });
        
        // Initialize height for CSS transitions
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
            answer.style.maxHeight = '0';
        }
    });
    
    // Add search functionality if FAQ section is large
    const faqSection = document.querySelector('.faq-section');
    if (faqSection && faqItems.length > 5) {
        addFaqSearch(faqSection, faqItems);
    }
}

function closeOtherFaqItems(currentItem) {
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== currentItem && item.classList.contains('active')) {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.setAttribute('aria-expanded', 'false');
            item.classList.remove('active');
            answer.style.maxHeight = '0';
        }
    });
}

function navigateFaqItems(direction, currentItem) {
    const allItems = Array.from(document.querySelectorAll('.faq-item'));
    const currentIndex = allItems.indexOf(currentItem);
    let nextIndex;
    
    if (direction === 'ArrowDown') {
        nextIndex = currentIndex < allItems.length - 1 ? currentIndex + 1 : 0;
    } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : allItems.length - 1;
    }
    
    allItems[nextIndex].querySelector('.faq-question').focus();
}

function addFaqSearch(faqSection, faqItems) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'faq-search';
    searchContainer.innerHTML = `
        <input type="text" placeholder="Search FAQs..." aria-label="Search FAQs">
        <i class="fas fa-search"></i>
    `;
    
    faqSection.insertBefore(searchContainer, faqSection.firstChild);
    
    const searchInput = searchContainer.querySelector('input');
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // Highlight matching text
                highlightText(item, searchTerm);
                
                // Auto-expand if match found
                if (!item.classList.contains('active')) {
                    item.querySelector('.faq-question').click();
                }
            } else {
                item.style.display = 'none';
            }
        });
    }, 300));
}

function highlightText(element, searchTerm) {
    // Remove previous highlights
    const highlights = element.querySelectorAll('.highlight');
    highlights.forEach(el => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
    });
    
    // Add new highlights if search term exists
    if (searchTerm) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(searchTerm)) {
                nodes.push(node);
            }
        }
        
        nodes.forEach(node => {
            const span = document.createElement('span');
            span.className = 'highlight';
            span.style.backgroundColor = 'yellow';
            span.style.color = 'black';
            
            const text = node.textContent;
            const regex = new RegExp(searchTerm, 'gi');
            const newText = text.replace(regex, match => `<span class="highlight">${match}</span>`);
            
            const div = document.createElement('div');
            div.innerHTML = newText;
            
            const parent = node.parentNode;
            while (div.firstChild) {
                parent.insertBefore(div.firstChild, node);
            }
            parent.removeChild(node);
        });
    }
}

// Enhanced Form Handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add novalidate to disable browser validation and use custom
        form.setAttribute('novalidate', '');
        
        // Add live validation on input change
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
        
        // Enhanced submit handling
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm(form);
            } else {
                // Focus on first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.focus();
                }
                
                // Show form-level error message
                showFormError(form, 'Please correct the errors above.');
            }
        });
        
        // Add password strength meter if password field exists
        const passwordInput = form.querySelector('input[type="password"]');
        if (passwordInput) {
            addPasswordStrengthMeter(passwordInput);
        }
        
        // Add character counter for textareas and inputs with maxlength
        form.querySelectorAll('textarea, input[maxlength]').forEach(input => {
            addCharacterCounter(input);
        });
    });
}

function validateField(field) {
    clearFieldError(field);
    
    let isValid = true;
    let message = '';
    
    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        message = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    }
    
    // URL validation
    else if (field.type === 'url' && field.value && !isValidUrl(field.value)) {
        isValid = false;
        message = 'Please enter a valid URL';
    }
    
    // Pattern validation
    else if (field.hasAttribute('pattern') && field.value) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(field.value)) {
            isValid = false;
            message = field.getAttribute('data-pattern-error') || 'Please match the requested format';
        }
    }
    
    // Custom validation
    else if (field.hasAttribute('data-validate') && field.value) {
        const validationType = field.getAttribute('data-validate');
        isValid = performCustomValidation(field.value, validationType);
        if (!isValid) {
            message = field.getAttribute('data-validation-error') || 'Invalid value';
        }
    }
    
    // Min/Max length validation
    else if (field.value) {
        const minLength = field.getAttribute('minlength');
        const maxLength = field.getAttribute('maxlength');
        
        if (minLength && field.value.length < parseInt(minLength)) {
            isValid = false;
            message = `Please enter at least ${minLength} characters`;
        }
        
        if (maxLength && field.value.length > parseInt(maxLength)) {
            isValid = false;
            message = `Please enter no more than ${maxLength} characters`;
        }
    }
    
    if (!isValid) {
        showFieldError(field, message);
    }
    
    return isValid;
}

function performCustomValidation(value, type) {
    switch (type) {
        case 'phone':
            return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,}$/.test(value);
        case 'zipcode':
            return /^\d{5}(-\d{4})?$/.test(value);
        case 'username':
            return /^[a-zA-Z0-9_-]{3,16}$/.test(value);
        default:
            return true;
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Position the error message
    field.parentNode.appendChild(errorDiv);
    
    // Add aria-invalid
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorDiv.id || generateId('error'));
    
    if (!errorDiv.id) {
        errorDiv.id = field.getAttribute('aria-describedby');
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        field.removeAttribute('aria-describedby');
        errorDiv.remove();
    }
}

function showFormError(form, message) {
    // Remove existing form error
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new form error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function addPasswordStrengthMeter(passwordInput) {
    const meterContainer = document.createElement('div');
    meterContainer.className = 'password-strength-meter';
    
    const meterBar = document.createElement('div');
    meterBar.className = 'password-strength-meter-bar';
    
    const meterText = document.createElement('div');
    meterText.className = 'password-strength-meter-text';
    
    meterContainer.appendChild(meterBar);
    meterContainer.appendChild(meterText);
    
    passwordInput.parentNode.appendChild(meterContainer);
    
    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updatePasswordStrengthMeter(meterBar, meterText, strength);
    });
}

function calculatePasswordStrength(password) {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (password.length > 12) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Cap at 5 for our meter
}

function updatePasswordStrengthMeter(meterBar, meterText, strength) {
    const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];
    
    meterBar.style.width = `${(strength / 5) * 100}%`;
    meterBar.style.backgroundColor = strengthColors[strength - 1] || '#e74c3c';
    
    meterText.textContent = strength > 0 ? strengthLabels[strength - 1] : '';
}

function addCharacterCounter(input) {
    const maxLength = input.getAttribute('maxlength');
    if (!maxLength) return;
    
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0/${maxLength}`;
    
    input.parentNode.appendChild(counter);
    
    input.addEventListener('input', function() {
        const currentLength = this.value.length;
        counter.textContent = `${currentLength}/${maxLength}`;
        
        if (currentLength > maxLength * 0.9) {
            counter.style.color = '#e74c3c';
        } else if (currentLength > maxLength * 0.75) {
            counter.style.color = '#f39c12';
        } else {
            counter.style.color = '#7f8c8d';
        }
    });
}

async function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const originalDisabled = submitBtn.disabled;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // In a real implementation, this would be an API call
        const formData = new FormData(form);
        const response = await simulateFormSubmission(formData);
        
        if (response.success) {
            showFormSuccess(form, response.message);
            form.reset();
            
            // Reset character counters
            form.querySelectorAll('.character-counter').forEach(counter => {
                counter.textContent = `0/${counter.dataset.maxlength}`;
                counter.style.color = '#7f8c8d';
            });
        } else {
            showFormError(form, response.message);
        }
    } catch (error) {
        showFormError(form, 'An error occurred while submitting the form. Please try again.');
        console.error('Form submission error:', error);
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = originalDisabled;
    }
}

async function simulateFormSubmission(formData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2;
    
    return {
        success: isSuccess,
        message: isSuccess ? 'Thank you for your submission!' : 'Server error. Please try again later.'
    };
}

function showFormSuccess(form, message) {
    // Remove existing success message
    const existingSuccess = form.querySelector('.form-success');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Add success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    form.insertBefore(successDiv, form.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Enhanced Animations
function initAnimations() {
    // Use Intersection Observer API for more efficient animations
    const animatedElements = document.querySelectorAll('.feature-card, .value-card, .stat-item, .gallery-item, .testimonial-card, .alert-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger when element is 50px from viewport bottom
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        // Set initial state for animations
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        observer.observe(el);
    });
    
    // Add scroll-triggered animations for sections
    const sections = document.querySelectorAll('section, .section, .hero');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Add parallax effects if needed
    initParallaxEffects();
    
    // Add hover animations for interactive elements
    initHoverAnimations();
}

function animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    // Add additional animation based on element type
    if (element.classList.contains('feature-card')) {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease';
    }
    
    if (element.classList.contains('stat-item')) {
        // Animate counters if they exist
        const counter = element.querySelector('h3');
        if (counter && !element.dataset.animated) {
            element.dataset.animated = 'true';
            animateCounter(counter);
        }
    }
}

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.5;
            const offset = scrollPosition * speed;
            element.style.transform = `translateY(${offset}px)`;
        });
    });
}

function initHoverAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .feature-card, .value-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Enhanced Dashboard Components
function initDashboardComponents() {
    // Update dashboard stats with real-time data
    const statsContainer = document.querySelector('.stats-grid, .stat-items');
    if (statsContainer) {
        initRealTimeStats();
    }
    
    // Initialize alert notifications with real-time updates
    const alertsContainer = document.querySelector('.alerts-list, .alert-items');
    if (alertsContainer) {
        initRealTimeAlerts();
    }
    
    // Initialize charts if they exist
    const charts = document.querySelectorAll('.chart-container');
    if (charts.length > 0) {
        initDashboardCharts();
    }
    
    // Add dashboard specific keyboard shortcuts
    initDashboardShortcuts();
    
    // Initialize dashboard tour for new users
    initDashboardTour();
}

function initRealTimeStats() {
    const stats = document.querySelectorAll('.stat-content h3, .stat-item h3');
    
    // Initial update
    updateStats(stats);
    
    // Set up periodic updates
    const statsUpdateInterval = setInterval(() => {
        updateStats(stats);
    }, 30000); // Update every 30 seconds
    
    // Clean up interval when page is hidden to save resources
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(statsUpdateInterval);
        } else {
            // Restart interval when page becomes visible again
            setInterval(() => {
                updateStats(stats);
            }, 30000);
        }
    });
}

async function updateStats(statsElements) {
    try {
        // Use a mock API endpoint for development
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const statsData = await response.json();
        
        // Create mock stats data based on the response
        const mockStats = {
            alerts: Math.floor(statsData.id * 12.5),
            users: Math.floor(statsData.id * 250),
            responses: Math.floor(statsData.id * 17.8),
            regions: Math.floor(statsData.id * 3.75)
        };
        
        statsElements.forEach(statElement => {
            const statType = statElement.parentNode.getAttribute('data-stat-type') || 
                            statElement.getAttribute('data-stat-type');
            
            if (statType && mockStats[statType]) {
                const currentValue = parseInt(statElement.textContent.replace(/,/g, '')) || 0;
                const newValue = mockStats[statType];
                
                // Only animate if the value has changed
                if (currentValue !== newValue) {
                    animateCounter(statElement, newValue);
                }
            }
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to random updates
        statsElements.forEach(statElement => {
            const currentValue = parseInt(statElement.textContent.replace(/,/g, '')) || 0;
            const newValue = currentValue + Math.floor(Math.random() * 10);
            animateCounter(statElement, newValue);
        });
    }
}

function initRealTimeAlerts() {
    // Set up WebSocket connection for real-time alerts
    const alertList = document.querySelector('.alerts-list, .alert-items');
    if (!alertList) return;
    
    // Simulate WebSocket connection
    simulateWebSocketAlerts(alertList);
    
    // Add alert filtering and sorting
    initAlertFilters();
    
    // Add alert sound for high priority alerts
    alertList.addEventListener('DOMNodeInserted', function(e) {
        if (e.target.classList.contains('alert-item')) {
            const priority = e.target.getAttribute('data-priority');
            if (priority === 'high') {
                playAlertSound();
                
                // Flash the alert
                flashElement(e.target, 3);
            }
        }
    });
}

function simulateWebSocketAlerts(alertList) {
    // Simulate receiving new alerts periodically
    setInterval(() => {
        // Only add new alerts 20% of the time to avoid spam
        if (Math.random() < 0.2) {
            const alertTypes = ['weather', 'security', 'safety', 'health'];
            const priorities = ['low', 'medium', 'high'];
            const regions = ['North', 'South', 'East', 'West', 'Central'];
            
            const newAlert = {
                id: Date.now(),
                type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                region: regions[Math.floor(Math.random() * regions.length)],
                message: 'New alert notification - please review immediately',
                timestamp: new Date()
            };
            
            addAlertToDOM(alertList, newAlert);
        }
    }, 10000); // Check for new alerts every 10 seconds
}

function addAlertToDOM(alertList, alert) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert-item priority-${alert.priority}`;
    alertElement.setAttribute('data-type', alert.type);
    alertElement.setAttribute('data-priority', alert.priority);
    alertElement.setAttribute('data-region', alert.region);
    
    const timeAgo = getTimeAgo(alert.timestamp);
    
    alertElement.innerHTML = `
        <div class="alert-icon">
            <i class="fas fa-${getAlertIcon(alert.type)}"></i>
        </div>
        <div class="alert-content">
            <h4 class="alert-title">${alert.message}</h4>
            <div class="alert-meta">
                <span class="alert-region">${alert.region}</span>
                <span class="alert-time">${timeAgo}</span>
            </div>
        </div>
        <div class="alert-actions">
            <button class="alert-action-btn" aria-label="View details">
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    // Add click handler
    alertElement.addEventListener('click', function() {
        this.classList.toggle('expanded');
        
        if (this.classList.contains('expanded')) {
            // Mark as read
            this.classList.add('read');
        }
    });
    
    // Add to top of list
    alertList.insertBefore(alertElement, alertList.firstChild);
    
    // Limit number of alerts shown
    const maxAlerts = 20;
    if (alertList.children.length > maxAlerts) {
        alertList.removeChild(alertList.lastChild);
    }
}

function getAlertIcon(alertType) {
    const iconMap = {
        'weather': 'cloud-showers-heavy',
        'security': 'shield-alt',
        'safety': 'exclamation-triangle',
        'health': 'first-aid'
    };
    
    return iconMap[alertType] || 'bell';
}

function initDashboardCharts() {
    // Initialize charts using Chart.js
    const chartContainers = document.querySelectorAll('.chart-container');
    
    chartContainers.forEach(container => {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        
        const chartType = container.getAttribute('data-chart-type') || 'line';
        const ctx = canvas.getContext('2d');
        
        // Sample chart data - in a real app this would come from an API
        let chartData;
        
        switch (chartType) {
            case 'bar':
                chartData = {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Emergency Reports',
                            data: [12, 19, 8, 15, 24, 17],
                            backgroundColor: 'rgba(44, 111, 187, 0.5)',
                            borderColor: 'rgba(44, 111, 187, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                };
                break;
                
            case 'pie':
                chartData = {
                    type: 'pie',
                    data: {
                        labels: ['Weather', 'Security', 'Health', 'Safety'],
                        datasets: [{
                            data: [35, 25, 20, 20],
                            backgroundColor: [
                                'rgba(44, 111, 187, 0.7)',
                                'rgba(231, 76, 60, 0.7)',
                                'rgba(46, 204, 113, 0.7)',
                                'rgba(241, 196, 15, 0.7)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                };
                break;
                
            default: // line chart
                chartData = {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Alert Trends',
                            data: [12, 19, 8, 15, 24, 17],
                            fill: false,
                            borderColor: 'rgba(44, 111, 187, 1)',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                };
        }
        
        new Chart(ctx, chartData);
    });
}

function initDashboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only trigger if not in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) searchInput.focus();
        }
        
        // 1-9 to switch dashboard tabs
        if (e.key >= '1' && e.key <= '9') {
            const tabIndex = parseInt(e.key) - 1;
            const tabs = document.querySelectorAll('.dashboard-tab');
            if (tabs[tabIndex]) {
                tabs[tabIndex].click();
            }
        }
    });
}

function initDashboardTour() {
    // Check if user has seen the tour before
    if (!localStorage.getItem('dashboardTourCompleted')) {
        // Show interactive tour of dashboard features
        setTimeout(() => {
            if (confirm('Would you like a quick tour of the dashboard features?')) {
                startDashboardTour();
            }
            localStorage.setItem('dashboardTourCompleted', 'true');
        }, 3000);
    }
}

function startDashboardTour() {
    // Implementation of a guided tour using a library like Shepherd.js
    // or a custom implementation
    console.log('Starting dashboard tour');
    // This would be implemented with a proper tour library
}

// Enhanced Alert Filters
function initAlertFilters() {
    const filterForm = document.querySelector('.alert-filters form');
    if (!filterForm) return;
    
    // Add real-time filtering as options change
    filterForm.addEventListener('change', debounce(function() {
        filterAlerts();
    }, 300));
    
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search alerts...';
    searchInput.className = 'alert-search';
    
    filterForm.appendChild(searchInput);
    
    searchInput.addEventListener('input', debounce(function() {
        filterAlerts();
    }, 500));
    
    // Add filter presets
    addFilterPresets(filterForm);
    
    // Add filter count badge
    addFilterCountBadge(filterForm);
}

function filterAlerts() {
    const filterForm = document.querySelector('.alert-filters form');
    const alerts = document.querySelectorAll('.alert-item');
    const regionFilter = document.getElementById('region-filter')?.value;
    const severityFilter = document.getElementById('severity-filter')?.value;
    const typeFilter = document.getElementById('type-filter')?.value;
    const searchText = document.querySelector('.alert-search')?.value.toLowerCase();
    
    let visibleCount = 0;
    
    alerts.forEach(alert => {
        let showAlert = true;
        
        // Region filter
        if (regionFilter && alert.getAttribute('data-region') !== regionFilter) {
            showAlert = false;
        }
        
        // Severity filter
        if (severityFilter && alert.getAttribute('data-severity') !== severityFilter) {
            showAlert = false;
        }
        
        // Type filter
        if (typeFilter && alert.getAttribute('data-type') !== typeFilter) {
            showAlert = false;
        }
        
        // Search filter
        if (searchText) {
            const alertText = alert.textContent.toLowerCase();
            if (!alertText.includes(searchText)) {
                showAlert = false;
            }
        }
        
        alert.style.display = showAlert ? 'flex' : 'none';
        
        if (showAlert) {
            visibleCount++;
        }
    });
    
    // Update filter count badge
    updateFilterCountBadge(visibleCount, alerts.length);
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount);
}

function addFilterPresets(filterForm) {
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'filter-presets';
    
    presetsContainer.innerHTML = `
        <span>Presets:</span>
        <button class="filter-preset" data-preset="high">High Priority</button>
        <button class="filter-preset" data-preset="unread">Unread Only</button>
        <button class="filter-preset" data-preset="clear">Clear All</button>
    `;
    
    filterForm.appendChild(presetsContainer);
    
    // Add preset handlers
    presetsContainer.querySelectorAll('.filter-preset').forEach(button => {
        button.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            
            switch (preset) {
                case 'high':
                    document.getElementById('severity-filter').value = 'high';
                    filterAlerts();
                    break;
                    
                case 'unread':
                    filterUnreadAlerts();
                    break;
                    
                case 'clear':
                    clearAllFilters();
                    break;
            }
        });
    });
}

function filterUnreadAlerts() {
    const alerts = document.querySelectorAll('.alert-item');
    
    alerts.forEach(alert => {
        const isRead = alert.classList.contains('read');
        alert.style.display = isRead ? 'none' : 'flex';
    });
    
    // Update UI
    const visibleCount = document.querySelectorAll('.alert-item[style="display: flex"]').length;
    updateFilterCountBadge(visibleCount, alerts.length);
    showNoResultsMessage(visibleCount);
}

function clearAllFilters() {
    // Clear form inputs
    const filterForm = document.querySelector('.alert-filters form');
    filterForm.reset();
    
    // Clear search
    const searchInput = document.querySelector('.alert-search');
    if (searchInput) searchInput.value = '';
    
    // Show all alerts
    const alerts = document.querySelectorAll('.alert-item');
    alerts.forEach(alert => {
        alert.style.display = 'flex';
    });
    
    // Update UI
    updateFilterCountBadge(alerts.length, alerts.length);
    
    // Remove no results message if present
    const noResults = document.querySelector('.no-alerts-message');
    if (noResults) noResults.remove();
}

function addFilterCountBadge() {
    const filterSection = document.querySelector('.alert-filters');
    if (!filterSection) return;
    
    const badge = document.createElement('div');
    badge.className = 'filter-count-badge';
    badge.textContent = '0/0';
    
    filterSection.appendChild(badge);
}

function updateFilterCountBadge(visible, total) {
    const badge = document.querySelector('.filter-count-badge');
    if (badge) {
        badge.textContent = `${visible}/${total}`;
        
        // Change color if no results
        if (visible === 0) {
            badge.style.backgroundColor = '#e74c3c';
        } else {
            badge.style.backgroundColor = '#2ecc71';
        }
    }
}

function showNoResultsMessage(visibleCount) {
    const alertsContainer = document.querySelector('.alerts-list, .alert-items');
    if (!alertsContainer) return;
    
    // Remove existing message
    const existingMessage = document.querySelector('.no-alerts-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add message if no results
    if (visibleCount === 0) {
        const message = document.createElement('div');
        message.className = 'no-alerts-message';
        message.innerHTML = `
            <i class="fas fa-inbox"></i>
            <h3>No alerts match your filters</h3>
            <p>Try adjusting your filters or search terms</p>
        `;
        
        alertsContainer.appendChild(message);
    }
}

// Enhanced Subscription Forms
function initSubscriptionForms() {
    const subscriptionForms = document.querySelectorAll('.subscription-form');
    
    subscriptionForms.forEach(form => {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Select all/none functionality
        addSelectAllToggle(form, checkboxes);
        
        // Enable submit button only if at least one checkbox is checked
        const toggleSubmitButton = () => {
            const atLeastOneChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
            submitBtn.disabled = !atLeastOneChecked;
        };
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', toggleSubmitButton);
        });
        
        // Initialize button state
        toggleSubmitButton();
        
        // Add subscription preferences saving
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSubscriptionPreferences(form, checkboxes);
        });
        
        // Load saved preferences if available
        loadSubscriptionPreferences(form, checkboxes);
    });
}

function addSelectAllToggle(form, checkboxes) {
    const selectAllContainer = document.createElement('div');
    selectAllContainer.className = 'select-all-container';
    
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'select-all';
    selectAllCheckbox.className = 'select-all-checkbox';
    
    const selectAllLabel = document.createElement('label');
    selectAllLabel.htmlFor = 'select-all';
    selectAllLabel.textContent = 'Select all';
    
    selectAllContainer.appendChild(selectAllCheckbox);
    selectAllContainer.appendChild(selectAllLabel);
    
    form.insertBefore(selectAllContainer, form.firstChild);
    
    // Select all functionality
    selectAllCheckbox.addEventListener('change', function() {
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            checkbox.dispatchEvent(new Event('change'));
        });
        
        updateSelectAllText(this);
    });
    
    // Update select all when individual checkboxes change
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            const someChecked = Array.from(checkboxes).some(cb => cb.checked);
            
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = someChecked && !allChecked;
            
            updateSelectAllText(selectAllCheckbox);
        });
    });
}

function updateSelectAllText(checkbox) {
    const label = checkbox.nextElementSibling;
    if (checkbox.checked) {
        label.textContent = 'Deselect all';
    } else {
        label.textContent = 'Select all';
    }
}

function saveSubscriptionPreferences(form, checkboxes) {
    const preferences = {};
    
    checkboxes.forEach(checkbox => {
        preferences[checkbox.name] = checkbox.checked;
    });
    
    // Save to localStorage
    localStorage.setItem('subscriptionPreferences', JSON.stringify(preferences));
    
    // Show success message
    showFormSuccess(form, 'Your subscription preferences have been saved!');
}

function loadSubscriptionPreferences(form, checkboxes) {
    const savedPreferences = localStorage.getItem('subscriptionPreferences');
    
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        checkboxes.forEach(checkbox => {
            if (preferences.hasOwnProperty(checkbox.name)) {
                checkbox.checked = preferences[checkbox.name];
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }
}

// Enhanced Registration Forms
function initRegistrationForms() {
    const registrationForms = document.querySelectorAll('.registration-form');
    
    registrationForms.forEach(form => {
        const passwordInput = form.querySelector('input[type="password"]');
        const confirmPasswordInput = form.querySelectorAll('input[type="password"]')[1];
        
        if (passwordInput && confirmPasswordInput) {
            // Real-time password confirmation validation
            confirmPasswordInput.addEventListener('input', debounce(() => {
                validatePasswordMatch(passwordInput, confirmPasswordInput);
            }, 300));
            
            // Validate on form submission
            form.addEventListener('submit', function(e) {
                if (!validatePasswordMatch(passwordInput, confirmPasswordInput)) {
                    e.preventDefault();
                }
            });
        }
        
        // Add terms and conditions agreement
        addTermsAgreement(form);
        
        // Add progressive profiling for better UX
        initProgressiveProfiling(form);
    });
}

function validatePasswordMatch(passwordInput, confirmPasswordInput) {
    if (passwordInput.value !== confirmPasswordInput.value) {
        showFieldError(confirmPasswordInput, 'Passwords do not match');
        return false;
    } else {
        removeErrorHighlight(confirmPasswordInput);
        return true;
    }
}

function addTermsAgreement(form) {
    // Check if terms agreement already exists
    if (form.querySelector('input[name="terms"]')) return;
    
    const termsContainer = document.createElement('div');
    termsContainer.className = 'form-terms';
    
    termsContainer.innerHTML = `
        <label>
            <input type="checkbox" name="terms" required>
            I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
        </label>
    `;
    
    form.appendChild(termsContainer);
    
    // Add validation for terms
    const termsCheckbox = termsContainer.querySelector('input[name="terms"]');
    termsCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            showFieldError(this, 'You must agree to the terms and conditions');
        } else {
            removeErrorHighlight(this);
        }
    });
}

function initProgressiveProfiling(form) {
    // For longer forms, break into steps
    const formGroups = form.querySelectorAll('.form-group');
    if (formGroups.length < 5) return; // Only for longer forms
    
    // Convert form to multi-step
    convertToMultiStepForm(form, formGroups);
}

function convertToMultiStepForm(form, formGroups) {
    // Store original form HTML
    const originalFormHTML = form.innerHTML;
    
    // Group form fields into steps (e.e., 3-4 fields per step)
    const steps = [];
    const stepSize = 3;
    
    for (let i = 0; i < formGroups.length; i += stepSize) {
        steps.push(Array.from(formGroups).slice(i, i + stepSize));
    }
    
    // Clear form and add step navigation
    form.innerHTML = `
        <div class="form-progress">
            <div class="progress-bar"></div>
            ${steps.map((_, index) => `
                <div class="progress-step" data-step="${index + 1}">
                    <span>${index + 1}</span>
                </div>
            `).join('')}
        </div>
        <div class="form-steps"></div>
        <div class="form-navigation">
            <button type="button" class="btn-prev" disabled>Previous</button>
            <button type="button" class="btn-next">Next</button>
        </div>
    ;
    
    const formSteps = form.querySelector('.form-steps');
    
    // Add steps to form
    steps.forEach((stepGroups, index) {
        const stepElement = document.createElement('div');
        stepElement.className = 'form-step' + (index === 0 ? ' active' : '');
        stepElement.dataset.step = index + 1;
        
        stepGroups.forEach(function(group) {
            stepElement.appendChild(group.cloneNode(true));
        });
        
        formSteps.appendChild(stepElement);
    });
    
    // Add navigation handlers
    const prevBtn = form.querySelector('.btn-prev');
    const nextBtn = form.querySelector('.btn-next');
    const progressBar = form.querySelector('.progress-bar');
    const progressSteps = form.querySelectorAll('.progress-step');
    
    let currentStep = 1;
    
    updateFormProgress();
    
    nextBtn.addEventListener('click', function() {
        if (currentStep < steps.length) {
            // Validate current step before proceeding
            if (validateFormStep(currentStep)) {
                currentStep++;
                updateFormProgress();
            }
        } else {
            // Submit form on last step
            if (validateFormStep(currentStep)) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
    
    prevBtn.addEventListener('click', function() {
        if (currentStep > 1) {
            currentStep--;
            updateFormProgress();
        }
    });
    
    function updateFormProgress() {
        // Update active step
        form.querySelectorAll('.form-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });
        
        // Update progress bar
        const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = progressPercent + '%';
        
        // Update progress steps
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= currentStep);
        });
        
        // Update button states
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === steps.length ? 'Submit' : 'Next';
    }
    
    function validateFormStep(step) {
        const stepElement = form.querySelector('.form-step[data-step="' + step + '"]');
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showFieldError(input, 'This field is required');
            } else {
                removeErrorHighlight(input);
            }
        });
        
        return isValid;
    }
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    // Use a more robust smooth scrolling implementation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty hashes
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                // Calculate position with offset for fixed headers
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Use smooth scrolling API if available
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    smoothScrollFallback(offsetPosition);
                }
                
                // Update URL without jumping
                history.pushState(null, null, href);
                
                // Focus the target for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove tabindex after blur to avoid focus trap
                targetElement.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    });
    
    // Add smooth scrolling for other elements that might need it
    document.addEventListener('keydown', function(e) {
        // Tab key navigation with smooth scrolling
        if (e.key === 'Tab') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.getBoundingClientRect) {
                const rect = activeElement.getBoundingClientRect();
                if (rect.bottom > window.innerHeight || rect.top < 0) {
                    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    });
}

function smoothScrollFallback(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 750;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// Enhanced Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-item h3, .stat-content h3, .counter');
    
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        // Store the target value in a data attribute
        if (!counter.dataset.target) {
            counter.dataset.target = counter.textContent.replace(/,/g, '');
            counter.textContent = '0';
        }
        
        observer.observe(counter);
    });
    
    // Add counter animations to other elements that might need them
    const otherCounters = document.querySelectorAll('[data-counter]');
    otherCounters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, customTarget) {
    const target = customTarget || parseInt(element.dataset.target);
    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // ~60 fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const initialValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (target - initialValue) / totalFrames;
    let currentValue = initialValue;
    
    const counter = setInterval(() => {
        frame++;
        
        currentValue += increment;
        
        // Format number based on its size
        let displayValue;
        if (target > 1000) {
            displayValue = Math.round(currentValue).toLocaleString();
        } else {
            displayValue = Math.round(currentValue);
        }
        
        element.textContent = displayValue;
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target.toLocaleString();
        }
    }, frameDuration);
}

// Enhanced Interactive Maps
function initInteractiveMaps() {
    const mapContainers = document.querySelectorAll('.map-container');
    
    if (mapContainers.length) {
        // Load map library dynamically
        loadMapLibrary().then(() => {
            mapContainers.forEach(container => {
                initMap(container);
            });
        }).catch(error => {
            console.error('Failed to load map library:', error);
            showMapFallback(container);
        });
    }
}

function loadMapLibrary() {
    // In a real implementation, this would load Leaflet, Google Maps, or another library
    return new Promise((resolve, reject) => {
        // Simulate library loading
        setTimeout(() => {
            // For demo purposes, we'll assume the library loaded successfully
            resolve();
            
            // In a real scenario, you might reject on error
            // reject(new Error('Failed to load map library'));
        }, 1000);
    });
}

function initMap(container) {
    const mapId = container.id || generateId('map');
    container.id = mapId;
    
    const mapConfig = {
        center: [40.7128, -74.0060], // New York
        zoom: 10,
        layers: [
            // Base layers would be defined here
        ],
        markers: [
            // Marker data would be loaded from an API
            { lat: 40.7128, lng: -74.0060, title: 'Emergency Center', type: 'emergency' },
            { lat: 40.7282, lng: -73.7942, title: 'Weather Alert', type: 'weather' },
            { lat: 40.7414, lng: -73.9903, title: 'Incident Report', type: 'incident' }
        ]
    };
    
    // Render the map
    renderMap(container, mapConfig);
    
    // Add map controls
    addMapControls(container);
    
    // Load real-time data
    loadMapData(container);
}

function renderMap(container, config) {
    // This would be implemented with the actual map library
    container.innerHTML =
        '<div class="map-content">' +
            '<div class="map-overlay">' +
                '<h3>Interactive Emergency Map</h3>' +
                '<p>Showing ' + config.markers.length + ' active incidents</p>' +
                '<div class="map-legend">' +
                    '<div class="legend-item">' +
                        '<span class="legend-color emergency"></span>' +
                        '<span>Emergency Centers</span>' +
                    '</div>' +
                    '<div class="legend-item">' +
                        '<span class="legend-color weather"></span>' +
                        '<span>Weather Alerts</span>' +
                    '</div>' +
                    '<div class="legend-item">' +
                        '<span class="legend-color incident"></span>' +
                        '<span>Incident Reports</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="map-placeholder">' +
                '<i class="fas fa-map-marked-alt"></i>' +
                '<p>Interactive Map Loaded</p>' +
                '<small>In a real implementation, this would show a live map</small>' +
            '</div>' +
        '</div>';
}

function addMapControls(container) {
    const controls = document.createElement('div');
    controls.className = 'map-controls';
    
    controls.innerHTML = `
    controls.innerHTML =
        '<button class="map-control" id="zoom-in" aria-label="Zoom in">' +
            '<i class="fas fa-plus"></i>' +
        '</button>' +
        '<button class="map-control" id="zoom-out" aria-label="Zoom out">' +
            '<i class="fas fa-minus"></i>' +
        '</button>' +
        '<button class="map-control" id="current-location" aria-label="Current location">' +
            '<i class="fas fa-location-arrow"></i>' +
        '</button>' +
        '<button class="map-control" id="map-layers" aria-label="Map layers">' +
            '<i class="fas fa-layer-group"></i>' +
        '</button>';
    container.appendChild(controls);
    
    // Add control functionality
    controls.querySelector('#current-location').addEventListener('click', function() {
        locateUserOnMap(container);
    });
}

function locateUserOnMap(container) {
    if (navigator.geolocation) {
        container.innerHTML += `
            <div class="map-locating">
        container.innerHTML +=
            '<div class="map-locating">' +
                '<i class="fas fa-spinner fa-spin"></i>' +
                '<span>Locating...</span>' +
            '</div>';
            position => {
                // Center map on user's location
                console.log('User located:', position.coords);
                document.querySelector('.map-locating')?.remove();
                
                // This would center the actual map
                container.querySelector('.map-placeholder p').textContent = 'Centered on your location';
            },
            error => {
                document.querySelector('.map-locating')?.remove();
                alert('Unable to get your location: ' + error.message);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function loadMapData(container) {
    // Simulate loading real-time map data
    setTimeout(() => {
        // This would add real markers to the map
        console.log('Map data loaded for', container.id);
    }, 1500);
}

function showMapFallback(container) {
    container.innerHTML = `
function showMapFallback(container) {
    container.innerHTML =
        '<div class="map-fallback">' +
            '<i class="fas fa-map-marked-alt"></i>' +
            '<h3>Map Unavailable</h3>' +
            '<p>Please check your connection or try again later</p>' +
            '<button class="retry-loading">Retry</button>' +
        '</div>';
}

// Enhanced Testimonial Sliders
function initTestimonialSliders() {
    const testimonialGrids = document.querySelectorAll('.testimonial-grid');
    
    testimonialGrids.forEach(grid => {
        if (grid.children.length > 3) {
            convertToSlider(grid);
        }
    });
    
    // Add auto-rotation to sliders
    initAutoRotation();
}

function convertToSlider(grid) {
    const wrapper = document.createElement('div');
    wrapper.className = 'testimonial-slider';
    wrapper.style.position = 'relative';
    
    grid.parentNode.insertBefore(wrapper, grid);
    wrapper.appendChild(grid);
    
    // Add navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.className = 'slider-nav slider-prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.setAttribute('aria-label', 'Previous testimonials');
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'slider-nav slider-next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.setAttribute('aria-label', 'Next testimonials');
    
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(nextBtn);
    
    // Add pagination indicators
    const items = grid.querySelectorAll('.testimonial-card');
    const itemsPerView = getItemsPerView();
    
    if (items.length > itemsPerView) {
        const pagination = document.createElement('div');
        pagination.className = 'slider-pagination';
        
        const pageCount = Math.ceil(items.length / itemsPerView);
        for (let i = 0; i < pageCount; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'pagination-indicator';
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
            indicator.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            });
            
            pagination.appendChild(indicator);
        }
        
        wrapper.appendChild(pagination);
    }
    
    // Initialize slider
    grid.style.display = 'flex';
    grid.style.transition = 'transform 0.3s ease';
    
    items.forEach(item => {
        item.style.flex = `0 0 calc(100% / ${itemsPerView} - 2rem)`;
        item.style.marginRight = '2rem';
    });

    let currentIndex = 0;

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function updateSlider() {
        const translateX = -currentIndex * (100 / itemsPerView);
        grid.style.transform = `translateX(${translateX}%)`;

        // Update active pagination indicator
        wrapper.querySelectorAll('.pagination-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });

        // Update ARIA attributes
        grid.setAttribute('aria-live', 'polite');
    }

    // Pagination click handlers
    wrapper.querySelectorAll('.pagination-indicator').forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
            goToSlide(i);
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        } else {
            // Loop to end
            currentIndex = Math.ceil(items.length / itemsPerView) - 1;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < Math.ceil(items.length / itemsPerView) - 1) {
            currentIndex++;
            updateSlider();
        } else {
            // Loop to beginning
            currentIndex = 0;
            updateSlider();
        }
    });
    wrapper.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }
    });
    
    // Touch swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    wrapper.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diffX = touchEndX - touchStartX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                prevBtn.click();
            } else {
                nextBtn.click();
            }
        }
    }, { passive: true });
    
    // Initialize
    updateSlider();
}
function getItemsPerView() {
    // Responsive items per view
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
}

function initAutoRotation() {
    const sliders = document.querySelectorAll('.testimonial-slider');

    sliders.forEach(slider => {
        let autoRotateInterval;

        const startRotation = () => {
            autoRotateInterval = setInterval(() => {
                const nextBtn = slider.querySelector('.slider-next');
                if (nextBtn) nextBtn.click();
            }, 5000); // Rotate every 5 seconds
        };

        const stopRotation = () => {
            clearInterval(autoRotateInterval);
        };

        // Start auto-rotation
        startRotation();

        // Pause on hover
        slider.addEventListener('mouseenter', stopRotation);
        slider.addEventListener('mouseleave', startRotation);

        // Pause on focus
        slider.addEventListener('focusin', stopRotation);
        slider.addEventListener('focusout', startRotation);
    });
}

// New: Service Worker for PWA functionality
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Only register service worker in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            window.addEventListener('load', function() {
                // Use a try-catch to handle any errors during registration
                try {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('SW registered: ', registration);
                    }).catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                    });
                } catch (error) {
                    console.log('SW registration error: ', error);
                }
            });
        } else {
            console.log('Service worker not registered in development mode');
        }
    }
}

// New: Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Only log if value is defined
                    if (entry.value !== undefined) {
                        console.log(`${entry.name}: ${entry.value}`);
                    }
                    // In a real app, you would send this to your analytics
                }
            });
            
            // Only observe supported entry types
            const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
            const entryTypesToObserve = supportedEntryTypes.filter(type => 
                ['paint', 'largest-contentful-paint', 'first-input'].includes(type)
            );
            
            if (entryTypesToObserve.length > 0) {
                observer.observe({ entryTypes: entryTypesToObserve });
            }
        } catch (error) {
            console.error('Performance monitoring failed:', error);
        }
    }
}

// New: Offline Functionality
function initOfflineFunctionality() {
    // Listen for online/offline events
    window.addEventListener('online', function() {
        showStatusMessage('Connection restored', 'success');
        // Sync any pending data
        syncPendingData();
    });
    
    window.addEventListener('offline', function() {
        showStatusMessage('You are currently offline', 'warning');
    });
    
    // Check initial status
    if (!navigator.onLine) {
        showStatusMessage('You are currently offline', 'warning');
    }
}

function showStatusMessage(message, type) {
    // Remove existing status message
    const existingStatus = document.getElementById('network-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    // Create new status message
    const status = document.createElement('div');
    status.id = 'network-status';
    status.className = `status-message status-${type}`;
    status.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(status);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (status.parentNode) {
            status.remove();
        }
    }, 5000);
}

function syncPendingData() {
    // Check if there's any data that needs to be synced with the server
    const pendingData = JSON.parse(localStorage.getItem('pendingData') || '[]');
    
    if (pendingData.length > 0) {
        showStatusMessage('Syncing offline data...', 'info');
        
        // Process each pending item
        const syncPromises = pendingData.map(item => {
            return fetch(item.url, {
                method: item.method,
                headers: item.headers,
                body: item.body
            }).then(response => {
                if (response.ok) {
                    // Remove from pending data
                    return true;
                }
                throw new Error('Sync failed');
            });
        });
        
        Promise.all(syncPromises).then(() => {
            // Clear pending data
            localStorage.removeItem('pendingData');
            showStatusMessage('All data synced successfully', 'success');
        }).catch(error => {
            showStatusMessage('Some data failed to sync', 'warning');
        });
    }
}

// New: Push Notifications
function initPushNotifications() {
    // Create a button for users to enable notifications
    const notifyButton = document.createElement('button');
    notifyButton.textContent = 'Enable Notifications';
    notifyButton.className = 'notify-btn';
    notifyButton.style.display = 'none';
    
    document.body.appendChild(notifyButton);
    
    // Only show button if notifications are supported but not granted
    if ('Notification' in window && Notification.permission === 'default') {
        notifyButton.style.display = 'block';
        
        notifyButton.addEventListener('click', function() {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    subscribeToPushNotifications();
                    notifyButton.style.display = 'none';
                }
            });
        });
    }
}

function subscribeToPushNotifications() {
    // This would be implemented with your push notification service
    console.log('Subscribing to push notifications');
    // Actual implementation would vary based on your backend
}

// New: Geolocation Features
function initGeolocationFeatures() {
    // Check if geolocation is needed on this page
    const needsGeolocation = document.querySelector('[data-geolocation]');
    
    if (needsGeolocation && 'geolocation' in navigator) {
        // Add a button to request location
        const geoButton = document.createElement('button');
        geoButton.className = 'geo-button';
        geoButton.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
        
        needsGeolocation.appendChild(geoButton);
        
        geoButton.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
            this.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                position => {
                    // Success
                    this.innerHTML = '<i class="fas fa-check-circle"></i> Location Found';
                    this.style.backgroundColor = '#2ecc71';
                    
                    // Use the location data
                    useLocationData(position.coords);
                },
                error => {
                    // Error
                    this.innerHTML = '<i class="fas fa-exclamation-circle"></i> Location Failed';
                    this.style.backgroundColor = '#e74c3c';
                    
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000
                }
            );
        });
    }
}

function useLocationData(coords) {
    // Use the location data in your application
    console.log('Using location:', coords);
    
    // Example: Update location-based elements
    document.querySelectorAll('[data-latitude]').forEach(el => {
        el.textContent = coords.latitude.toFixed(6);
    });
    
    document.querySelectorAll('[data-longitude]').forEach(el => {
        el.textContent = coords.longitude.toFixed(6);
    });
    
    // You could also update maps, weather, or other location-based content
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

function flashElement(element, times = 3) {
    let count = 0;
    const interval = setInterval(() => {
        element.classList.toggle('flash');
        count++;
        if (count >= times * 2) {
            clearInterval(interval);
            element.classList.remove('flash');
        }
    }, 200);
}

function playEmergencySound() {
    // Play a warning sound
    try {
        // Create a simple beep sound using the Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio play failed:', error);
    }
}

function stopEmergencySound() {
    // Stop any playing emergency sounds
    // Implementation would depend on how sounds are managed
}

function flashEmergencyAlert() {
    // Flash the screen or important elements
    document.documentElement.classList.add('emergency-flash');
    
    setTimeout(() => {
        document.documentElement.classList.remove('emergency-flash');
    }, 3000);
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Base API URL configuration
// const API_BASE_URL = window.location.origin + '/api'; // Use relative path to avoid CORS issues
// Enhanced API functions to replace simulated ones
async function fetchNewsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/news?limit=5&priority=high`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch news data:', error);
        // Fallback to local storage or empty array
        return getCachedData('news') || [];
    }
}

async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const data = await response.json();
        // Cache the data for offline use
        cacheData('weather', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Return cached data if available
        return getCachedData('weather') || {
            temp: Math.floor(Math.random() * 15) + 15,
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            location: 'Current Location'
        };
    }
}

async function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const originalDisabled = submitBtn.disabled;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        
        const response = await fetch(`${API_BASE_URL}/form-submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(formObject)
        });
        
        if (!response.ok) {
            throw new Error(`Form submission failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            showFormSuccess(form, result.message);
            form.reset();
        } else {
            showFormError(form, result.message);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        // Save form data for later submission
        saveFormForLater(form);
        showFormError(form, 'Network error. Your form has been saved for later submission.');
    } finally {
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = originalDisabled;
    }
}

// Utility functions for data caching
function cacheData(key, data) {
    localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

function getCachedData(key) {
    const item = localStorage.getItem(`cache_${key}`);
    if (!item) return null;
    
    const { data, timestamp } = JSON.parse(item);
    // Return data if it's less than 10 minutes old
    if (Date.now() - timestamp < 10 * 60 * 1000) {
        return data;
    }
    return null;
}

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function saveFormForLater(form) {
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    const pendingForms = JSON.parse(localStorage.getItem('pendingForms') || '[]');
    pendingForms.push({
        formData: formObject,
        url: `${API_BASE_URL}/form-submission`,
        timestamp: Date.now()
    });
    
    localStorage.setItem('pendingForms', JSON.stringify(pendingForms));
}

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNewsTicker,
        initNavigation,
        initWeatherWidget,
        initEmergencyButton,
        initFAQAccordions,
        initForms,
        initAnimations,
        initDashboardComponents,
        initAlertFilters,
        initSubscriptionForms,
        initRegistrationForms,
        initSmoothScrolling,
        initCounters,
        initInteractiveMaps,
        initTestimonialSliders,
        initServiceWorker,
        initPerformanceMonitoring,
        initOfflineFunctionality,
        initPushNotifications,
        initGeolocationFeatures
    };
}

// Helper functions for news ticker navigation
function simulatePrevButtonClick() {
    const prevBtn = document.querySelector('.ticker-prev');
    if (prevBtn) prevBtn.click();
}

function simulateNextButtonClick() {
    const nextBtn = document.querySelector('.ticker-next');
    if (nextBtn) nextBtn.click();
}

// Helper function for emergency location tracking
function startEmergencyLocationTracking() {
    if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
            position => {
                console.log('Emergency location:', position.coords);
                // In a real implementation, this would send the location to emergency services
            },
            error => {
                console.error('Emergency location tracking failed:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
        
        // Store watchId to clear it later
        localStorage.setItem('emergencyLocationWatchId', watchId);
    }
}

// Helper function for sending emergency signals
function sendEmergencySignal(type) {
    // In a real implementation, this would send a signal to your backend
    console.log(`Emergency signal sent: ${type}`);
    
    // Simulate sending to backend
    fetch(`${API_BASE_URL}/emergency`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
            type,
            timestamp: new Date().toISOString(),
            location: getLastKnownLocation() // You would need to implement this
        })
    }).catch(error => {
        console.error('Failed to send emergency signal:', error);
    });
}

function getLastKnownLocation() {
    // In a real implementation, this would get the last known location from geolocation API
    return {
        latitude: null,
        longitude: null
    };
}

function playAlertSound() {
    // Play a different sound for alerts
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.2;
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
        console.log('Alert sound failed:', error);
    }
}

// Remove error highlighting function
function removeErrorHighlight(input) {
    input.classList.remove('error');
    
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        input.removeAttribute('aria-describedby');
        errorDiv.remove();
    }
}

// Initialize the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplication);
} else {
    initApplication();
}

function initApplication() {
    // Your initialization code here
    console.log('DisasterAlert System initialized');
}

function getItemsPerView() {
    // Responsive items per view
    const width = window.innerWidth;
    if (width < 768)
        return 1;
    if (width < 1024)
        return 2;
    return 3;
}
function initAutoRotation() {
    const sliders = document.querySelectorAll('.testimonial-slider');
    sliders.forEach(slider => {
        let autoRotateInterval;
        const startRotation = () => {
            autoRotateInterval = setInterval(() => {
                const nextBtn = slider.querySelector('.slider-next');
                if (nextBtn)
                    nextBtn.click();
            }, 5000);
        };
        const stopRotation = () => {
            clearInterval(autoRotateInterval);
        };
        // Start auto-rotation
        startRotation();
        // Pause on hover
        slider.addEventListener('mouseenter', stopRotation);
        slider.addEventListener('mouseleave', startRotation);
        // Pause on focus
        slider.addEventListener('focusin', stopRotation);
        slider.addEventListener('focusout', startRotation);
    });
}
    
// New: Service Worker for PWA functionality
// New: Service Worker for PWA functionality
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Only register service worker in production
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            window.addEventListener('load', function() {
                // Use a try-catch to handle any errors during registration
                try {
                    navigator.serviceWorker.register('/sw.js').then(function(registration) {
                        console.log('SW registered: ', registration);
                    }
                    ).catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                    });
                } catch (error) {   
                    console.log('SW registration error: ', error);
                }
            });
        }
        else {
            console.log('Service worker not registered in development mode');
        }
    }
}
// New: Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals  
    if ('PerformanceObserver' in window) {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    // Only log if value is defined
                    if (entry.value !== undefined) {
                        console.log(`${entry.name}: ${entry.value}`);
                    }
                    // In a real app, you would send this to your analytics
                }
            });
            // Only observe supported entry types
            const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];
            const entryTypesToObserve = supportedEntryTypes.filter(type =>
                ['paint', 'largest-contentful-paint', 'first-input'].includes(type)
            );
            if (entryTypesToObserve.length > 0) {
                observer.observe({ entryTypes: entryTypesToObserve });
            }
        } catch (error) {
            console.error('Performance monitoring failed:', error);
        }

    }
}
// New: Offline Functionality
function initOfflineFunctionality() {
    // Listen for online/offline events 
    window.addEventListener('online', function() {
        showStatusMessage('Connection restored', 'success');
        // Sync any pending data
        syncPendingData();
    }
    );
    window.addEventListener('offline', function() {
        showStatusMessage('You are currently offline', 'warning');
    }
    );
    // Check initial status
    if (!navigator.onLine) {
        showStatusMessage('You are currently offline', 'warning');
    }
}
function showStatusMessage(message, type) {
    // Remove existing status message
    const existingStatus = document.getElementById('network-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    // Create new status message
    const status = document.createElement('div');
    status.id = 'network-status';
    status.className = `status-message status-${type}`;
    status.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(status);  
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (status.parentNode) {
            status.remove();
        }
    }, 5000);
}
function syncPendingData() {
    // Check if there's any data that needs to be synced with the server
    const pendingData = JSON.parse(localStorage.getItem('pendingData') || '[]');
    if (pendingData.length > 0) {
        showStatusMessage('Syncing offline data...', 'info');
        // Process each pending item
        const syncPromises = pendingData.map(item => {
            return fetch(item.url, {
                method: item.method,
                headers: item.headers,
                body: item.body
            }).then(response => {
                if (response.ok) {
                    // Remove from pending data
                    return true;
                }
                throw new Error('Sync failed');
            }
            );
        });
        Promise.all(syncPromises).then(() => {
            // Clear pending data
            localStorage.removeItem('pendingData');
            showStatusMessage('All data synced successfully', 'success');
        }).catch(error => {
            showStatusMessage('Some data failed to sync', 'warning');
        }
        );
    }
}
function showStatusMessage(message, type) {
    // Remove existing status message
    const existingStatus = document.getElementById('network-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    // Create new status message
    const status = document.createElement('div');
    status.id = 'network-status';
    status.className = `status-message status-${type}`;
    status.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(status);
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (status.parentNode) {
            status.remove();
        }
    }, 5000);
}
function syncPendingData() {
    // Check if there's any data that needs to be synced with the server
    const pendingData = JSON.parse(localStorage.getItem('pendingData') || '[]');
    if (pendingData.length > 0) {
        showStatusMessage('Syncing offline data...', 'info');
        // Process each pending item
        const syncPromises = pendingData.map(item => {
            return fetch(item.url, {
                method: item.method,
                headers: item.headers,
                body: item.body
            }).then(response => {
                if (response.ok) {
                    // Remove from pending data
                    return true;
                }
                throw new Error('Sync failed');
            }
            );
        });
        Promise.all(syncPromises).then(() => {
            // Clear pending data
            localStorage.removeItem('pendingData');
            showStatusMessage('All data synced successfully', 'success');
        }).catch(error => {
            showStatusMessage('Some data failed to sync', 'warning');
        }
        );
    }
}
// New: Push Notifications
function initPushNotifications() {
    // Create a button for users to enable notifications
    const notifyButton = document.createElement('button');
    notifyButton.textContent = 'Enable Notifications';
    notifyButton.className = 'notify-btn';
    notifyButton.style.display = 'none';
    document.body.appendChild(notifyButton);
    // Only show button if notifications are supported but not granted
    if ('Notification' in window && Notification.permission === 'default') {
        notifyButton.style.display = 'block';
        notifyButton.addEventListener('click', function() {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted');
                    subscribeToPushNotifications();
                    notifyButton.style.display = 'none';
                }
            }
            );
        });
    }
}
function subscribeToPushNotifications() {
    // This would be implemented with your push notification service
    console.log('Subscribing to push notifications');
    // Actual implementation would vary based on your backend
}
// New: Geolocation Features
function initGeolocationFeatures() {
    // Check if geolocation is needed on this page
    const needsGeolocation = document.querySelector('[data-geolocation]');
    if (needsGeolocation && 'geolocation' in navigator) {
        // Add a button to request location
        const geoButton = document.createElement('button');
        geoButton.className = 'geo-button';
        geoButton.innerHTML = '<i class="fas fa-location-arrow"></i> Use My Location';
        needsGeolocation.appendChild(geoButton);
        geoButton.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating...';
            this.disabled = true;
            navigator.geolocation.getCurrentPosition(
                position => {
                    // Success
                    this.innerHTML = '<i class="fas fa-check-circle"></i> Location Found';
                    this.style.backgroundColor = '#2ecc71'; 
                    // Use the location data
                    useLocationData(position.coords);
                }
                ,
                error => {
                    // Error
                    this.innerHTML = '<i class="fas fa-exclamation-circle"></i> Location Failed';
                    this.style.backgroundColor = '#e74c3c';
                    console.error('Geolocation error:', error);
                }
                ,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 600000
                }
            );
        }
        );
    }
}
function useLocationData(coords) {
    // Use the location data in your application
    console.log('Using location:', coords);
    // Example: Update location-based elements
    document.querySelectorAll('[data-latitude]').forEach(el => {
        el.textContent = coords.latitude.toFixed(6);
    }
    );
    document.querySelectorAll('[data-longitude]').forEach(el => {
        el.textContent = coords.longitude.toFixed(6);
    }
    );
    // You could also update maps, weather, or other location-based content
}
// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
function flashElement(element, times = 3) {
    let count = 0;
    const interval = setInterval(() => {
        element.classList.toggle('flash');
        count++;            
        if (count >= times * 2) {
            clearInterval(interval);
            element.classList.remove('flash');

        }
    }, 200);
}
function playEmergencySound() {
    // Play a warning sound
    try {
        // Create a simple beep sound using the Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    catch (error) {
        console.log('Audio play failed:', error);
    }
}
function stopEmergencySound() {
    // Stop any playing emergency sounds
    // Implementation would depend on how sounds are managed
}
function flashEmergencyAlert() {
    // Flash the screen or important elements
    document.documentElement.classList.add('emergency-flash');
    setTimeout(() => {
        document.documentElement.classList.remove('emergency-flash');
    }, 3000);
}
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
// Base API URL configuration
const API_BASE_URL = window.location.origin + '/api'; // Use relative path to avoid CORS issues
// Enhanced API functions to replace simulated ones
async function fetchNewsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/news?limit=5&priority=high`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch news data:', error);
        // Fallback to local storage or empty array
        return getCachedData('news') || [];
    }
}
async function fetchWeatherData(lat, lon) {
    try {
        const response = await fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        const data = await response.json();
        // Cache the data for offline use
        cacheData('weather', data);
        return data;
    }
    catch (error) {
        console.error('Failed to fetch weather data:', error);
        // Return cached data if available
        return getCachedData('weather') || {
            temp: Math.floor(Math.random() * 15) + 15,                              
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5,
            location: 'Current Location'
        };
    }
}
function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    const originalDisabled = submitBtn.disabled;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(form);
        const formDataObj = Object.fromEntries(formData.entries());
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        for (const field of requiredFields) {
            if (!field.value.trim()) {
                throw new Error(`Please fill in the ${field.name || field.placeholder || 'required'} field`);
            }
        }
        
        // Email validation if email field exists
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value && !isValidEmail(emailField.value)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Prepare fetch options
        const fetchOptions = {
            method: form.method || 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(formDataObj)
        };
        
        // Use form action or default to API endpoint
        const actionUrl = form.action || `${API_BASE_URL}/${form.id || 'form'}`;
        
        return fetch(actionUrl, fetchOptions)
            .then(async response => {
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || `Server error: ${response.status}`);
                }
                
                return data;
            })
            .then(data => {
                // Show success message
                showFormStatus(form, 'Form submitted successfully!', 'success');
                
                // Reset form if successful
                if (form.reset) {
                    form.reset();
                }
                
                // Trigger success event
                form.dispatchEvent(new CustomEvent('formSuccess', { 
                    detail: { data, formData: formDataObj } 
                }));
                
                return data;
            })
            .catch(error => {
                // Show error message
                showFormStatus(form, error.message || 'An error occurred. Please try again.', 'error');
                
                // Trigger error event
                form.dispatchEvent(new CustomEvent('formError', { 
                    detail: { error: error.message } 
                }));
                
                throw error;
            })
            .finally(() => {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = originalDisabled;
            });
            
    } catch (error) {
        // Handle synchronous errors (validation errors)
        showFormStatus(form, error.message, 'error');
        
        // Restore button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = originalDisabled;
        
        // Re-throw for further handling
        throw error;
    }
}

function showFormStatus(form, message, type) {
    // Remove existing status messages
    const existingStatus = form.querySelector('.form-status');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create status message element
    const statusElement = document.createElement('div');
    statusElement.className = `form-status form-status-${type}`;
    statusElement.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Insert at the beginning of the form or before submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        form.insertBefore(statusElement, submitBtn);
    } else {
        form.prepend(statusElement);
    }
    
    // Auto-remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (statusElement.parentNode) {
                statusElement.remove();
            }
        }, 5000);
    }
}

// Optional: Add CSS for form status messages
const formStatusStyles = `
.form-status {
    padding: 12px;
    margin: 10px 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
}

.form-status-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.form-status-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.form-status i {
    font-size: 16px;
}
`;

// Inject styles if not already present
if (!document.querySelector('#form-status-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'form-status-styles';
    styleElement.textContent = formStatusStyles;
    document.head.appendChild(styleElement);
}
// Example usage:
// document.getElementById('myForm').addEventListener('submit', function(e) {
//     e.preventDefault();
//     submitForm(this);
// });
    }
}
}
    

