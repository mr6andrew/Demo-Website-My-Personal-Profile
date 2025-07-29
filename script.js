// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 50,
    delay: 0
});

// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// Dynamic Roles for Title and Subtitle
const titleRoles = [
    "Andrew L",
    "MaybeMe",
    "JustMe", 
    "SomeCode",
    "NotSure",
    "MildOne",
    "FunLoop",
    "CodeKid",
    "KindDev",
    "TryAndy",
    "MayHelp",
    "?"
];

const subtitleRoles = [
    "UI Designer",
    "UX Designer", 
    "Web Designer",
    "Frontend Dev",
    "Digital Artist",
    "Creative Pro",
    "Visual Designer",
    "Product Designer",
    "Full Stack Dev",
    "Creative Dir"
];

let currentTitleIndex = 0;
let currentRoleIndex = 0;
let currentTitleCharIndex = 0;
let currentRoleCharIndex = 0;
let isDeletingTitle = false;
let isDeletingRole = false;
let titleTypingSpeed = 100;
let roleTypingSpeed = 100;

// Dynamic Typing Effect for Title and Roles
function typeTitle() {
    const titleElement = document.querySelector('.typing-text');
    if (!titleElement) return;
    
    const currentTitle = titleRoles[currentTitleIndex];
    
    if (isDeletingTitle) {
        // Delete characters
        titleElement.innerHTML = '<span style="color: white;">Hello, I\'m </span><span class="glass-role">' + currentTitle.substring(0, currentTitleCharIndex - 1) + '</span><span class="cursor">|</span>';
        currentTitleCharIndex--;
        titleTypingSpeed = 50;
    } else {
        // Type characters
        titleElement.innerHTML = '<span style="color: white;">Hello, I\'m </span><span class="glass-role">' + currentTitle.substring(0, currentTitleCharIndex + 1) + '</span><span class="cursor">|</span>';
        currentTitleCharIndex++;
        titleTypingSpeed = 100;
    }
    
    // Handle transitions
    if (!isDeletingTitle && currentTitleCharIndex === currentTitle.length) {
        // Pause at end of word
        titleTypingSpeed = 2000;
        isDeletingTitle = true;
    } else if (isDeletingTitle && currentTitleCharIndex === 0) {
        // Move to next word
        isDeletingTitle = false;
        currentTitleIndex = (currentTitleIndex + 1) % titleRoles.length;
        titleTypingSpeed = 500;
    }
    
    setTimeout(typeTitle, titleTypingSpeed);
}

function typeRoles() {
    const roleElement = document.querySelector('.role-text');
    if (!roleElement) return;
    
    const currentRole = subtitleRoles[currentRoleIndex];
    
    if (isDeletingRole) {
        // Delete characters
        roleElement.innerHTML = currentRole.substring(0, currentRoleCharIndex - 1);
        currentRoleCharIndex--;
        roleTypingSpeed = 50;
    } else {
        // Type characters
        roleElement.innerHTML = currentRole.substring(0, currentRoleCharIndex + 1);
        currentRoleCharIndex++;
        roleTypingSpeed = 100;
    }
    
    // Handle transitions
    if (!isDeletingRole && currentRoleCharIndex === currentRole.length) {
        // Pause at end of word
        roleTypingSpeed = 2000;
        isDeletingRole = true;
    } else if (isDeletingRole && currentRoleCharIndex === 0) {
        // Move to next word
        isDeletingRole = false;
        currentRoleIndex = (currentRoleIndex + 1) % subtitleRoles.length;
        roleTypingSpeed = 500;
    }
    
    // Aggressively remove any cursor characters
    roleElement.innerHTML = roleElement.innerHTML.replace(/[」|_|│|┃|▌|▐|▎|▏|▊|▋|▌|▍|▎|▏]/g, '');
    
    setTimeout(typeRoles, roleTypingSpeed);
}

// Initialize typing effects
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    
    // Set home as active
    setHomeAsActive();
    
    // Start only title typing effect immediately
    typeTitle();
});

// Ensure page starts at top when fully loaded
window.addEventListener('load', function() {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Set home as active
    setHomeAsActive();
});

// Profile card spotlight effect with 3D tilt
function initProfileSpotlight() {
    const profileCard = document.querySelector('.profile-card');
    if (!profileCard) return;

    const handleMouseMove = (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate center of the card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate mouse position relative to center
        const mouseX = x - centerX;
        const mouseY = y - centerY;
        
        // Calculate rotation angles (max 15 degrees)
        const rotateX = (mouseY / centerY) * -15;
        const rotateY = (mouseX / centerX) * 15;
        
        // Update spotlight position
        profileCard.style.setProperty('--mouse-x', `${x}px`);
        profileCard.style.setProperty('--mouse-y', `${y}px`);
        
        // Apply 3D tilt
        profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
    };

    const handleMouseLeave = () => {
        profileCard.style.setProperty('--mouse-x', '50%');
        profileCard.style.setProperty('--mouse-y', '50%');
        profileCard.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    };

    profileCard.addEventListener('mousemove', handleMouseMove);
    profileCard.addEventListener('mouseleave', handleMouseLeave);
}

// Initialize profile spotlight effect
document.addEventListener('DOMContentLoaded', function() {
    initProfileSpotlight();
});

// Navbar scroll effect with color transition
window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Color transition based on scroll position
    const heroSection = document.querySelector('.hero');
    const aboutSection = document.querySelector('.about');
    
    if (heroSection && aboutSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const aboutTop = aboutSection.offsetTop;
        
        // Calculate transition progress (0 = over hero, 1 = over white sections)
        let transitionProgress = 0;
        
        if (scrollY >= heroBottom - 100) {
            // Start transition when approaching end of hero
            transitionProgress = Math.min((scrollY - (heroBottom - 100)) / 200, 1);
        } else if (scrollY < heroBottom - 100) {
            // Over hero section - white text
            transitionProgress = 0;
        }
        
        // Apply color transition
        navbar.style.setProperty('--text-color', `rgba(${255 * (1 - transitionProgress)}, ${255 * (1 - transitionProgress)}, ${255 * (1 - transitionProgress)}, ${0.9 + transitionProgress * 0.1})`);
        navbar.style.setProperty('--text-hover-color', `rgba(${255 * (1 - transitionProgress)}, ${255 * (1 - transitionProgress)}, ${255 * (1 - transitionProgress)}, 1)`);
    }
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Mobile menu toggle
hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Reset hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        });
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    // Clear all active states first
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Check if we're at the very top (home section)
    if (scrollPos < 150) {
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
        // Reset navbar to transparent
        navbar.classList.remove('white-navbar');
        // Hide pixel trail when home is active
        if (pixelTrailController) {
            pixelTrailController.hidePixelTrailOnHome();
        }
        return;
    }
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            if (navLink) navLink.classList.add('active');
            
            // Add white navbar class when in About section
            if (sectionId === 'about') {
                navbar.classList.add('white-navbar');
            } else {
                navbar.classList.remove('white-navbar');
            }
            
            // Show pixel trail when not on home section
            if (pixelTrailController) {
                pixelTrailController.hidePixelTrailOnHome();
            }
        }
    });
}

// Scroll-based navigation will be enabled after the initial home forcing is complete

// About section text animation
function animateAboutText() {
    const aboutSection = document.getElementById('about');
    const aboutText = aboutSection.querySelector('.about-text');
    const aboutH3 = aboutText.querySelector('h3');
    const aboutParagraphs = aboutText.querySelectorAll('p');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the h3 first
                aboutH3.classList.add('animate');
                
                // Animate paragraphs with staggered delay
                aboutParagraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.classList.add('animate');
                    }, 400 + (index * 200)); // 400ms delay for h3, then 200ms between each paragraph
                });
                
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(aboutSection);
}

// Initialize about text animation
animateAboutText();

// Back to top button
window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact form handling
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Message sent successfully!', 'success');
        this.reset();
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (hero && heroParticles) {
        const rate = scrolled * -0.5;
        heroParticles.style.transform = `translateY(${rate}px)`;
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Skill items hover effect enhancement
document.addEventListener('DOMContentLoaded', function() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Project cards hover effect enhancement
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth reveal animation for stats
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const text = stat.textContent;
        const target = parseInt(text.replace(/[^0-9]/g, ''));
        const suffix = text.includes('+') ? '+' : text.includes('%') ? '%' : '';
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 30);
    });
}

// Trigger stats animation when about section is in view
const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    aboutObserver.observe(aboutSection);
}

// Enhanced scroll performance
let ticking = false;

function updateOnScroll() {
    updateActiveNavLink();
    ticking = false;
}

window.addEventListener('scroll', function() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// Create FaultyTerminal background effect for home section
function createFaultyTerminal() {
    const container = document.getElementById('faulty-terminal');
    if (!container) return;
    
    // Check if OGL is available
    if (typeof window.OGL === 'undefined') {
        console.warn('OGL library not loaded, using fallback background');
        container.style.background = 'linear-gradient(45deg, #0066ff, #0052cc)';
        return;
    }
    
    const { Renderer, Program, Mesh, Color, Triangle } = window.OGL;
    
    // Vertex shader
    const vertexShader = `
        attribute vec2 position;
        attribute vec2 uv;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;
    
    // Fragment shader (FaultyTerminal effect)
    const fragmentShader = `
        precision mediump float;
        
        varying vec2 vUv;
        
        uniform float iTime;
        uniform vec3  iResolution;
        uniform float uScale;
        
        uniform vec2  uGridMul;
        uniform float uDigitSize;
        uniform float uScanlineIntensity;
        uniform float uGlitchAmount;
        uniform float uFlickerAmount;
        uniform float uNoiseAmp;
        uniform float uChromaticAberration;
        uniform float uDither;
        uniform float uCurvature;
        uniform vec3  uTint;
        uniform vec2  uMouse;
        uniform float uMouseStrength;
        uniform float uUseMouse;
        uniform float uPageLoadProgress;
        uniform float uUsePageLoadAnimation;
        uniform float uBrightness;
        
        float time;
        
        float hash21(vec2 p){
            p = fract(p * 234.56);
            p += dot(p, p + 34.56);
            return fract(p.x * p.y);
        }
        
        float noise(vec2 p)
        {
            return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
        }
        
        mat2 rotate(float angle)
        {
            float c = cos(angle);
            float s = sin(angle);
            return mat2(c, -s, s, c);
        }
        
        float fbm(vec2 p)
        {
            p *= 1.1;
            float f = 0.0;
            float amp = 0.5 * uNoiseAmp;
            
            mat2 modify0 = rotate(time * 0.02);
            f += amp * noise(p);
            p = modify0 * p * 2.0;
            amp *= 0.454545;
            
            mat2 modify1 = rotate(time * 0.02);
            f += amp * noise(p);
            p = modify1 * p * 2.0;
            amp *= 0.454545;
            
            mat2 modify2 = rotate(time * 0.08);
            f += amp * noise(p);
            
            return f;
        }
        
        float pattern(vec2 p, out vec2 q, out vec2 r) {
            vec2 offset1 = vec2(1.0);
            vec2 offset0 = vec2(0.0);
            mat2 rot01 = rotate(0.1 * time);
            mat2 rot1 = rotate(0.1);
            
            q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
            r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
            return fbm(p + r);
        }
        
        float digit(vec2 p){
            vec2 grid = uGridMul * 15.0;
            vec2 s = floor(p * grid) / grid;
            p = p * grid;
            vec2 q, r;
            float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
            
            if(uUseMouse > 0.5){
                vec2 mouseWorld = uMouse * uScale;
                float distToMouse = distance(s, mouseWorld);
                float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
                intensity += mouseInfluence;
                
                float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
                intensity += ripple;
            }
            
            if(uUsePageLoadAnimation > 0.5){
                float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
                float cellDelay = cellRandom * 0.8;
                float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
                
                float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
                intensity *= fadeAlpha;
            }
            
            p = fract(p);
            p *= uDigitSize;
            
            float px5 = p.x * 5.0;
            float py5 = (1.0 - p.y) * 5.0;
            float x = fract(px5);
            float y = fract(py5);
            
            float i = floor(py5) - 2.0;
            float j = floor(px5) - 2.0;
            float n = i * i + j * j;
            float f = n * 0.0625;
            
            float isOn = step(0.1, intensity - f);
            float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
            
            return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
        }
        
        float onOff(float a, float b, float c)
        {
            return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
        }
        
        float displace(vec2 look)
        {
            float y = look.y - mod(iTime * 0.25, 1.0);
            float window = 1.0 / (1.0 + 50.0 * y * y);
            return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
        }
        
        vec3 getColor(vec2 p){
            float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
            bar *= uScanlineIntensity;
            
            float displacement = displace(p);
            p.x += displacement;
        
            if (uGlitchAmount != 1.0) {
                float extra = displacement * (uGlitchAmount - 1.0);
                p.x += extra;
            }
        
            float middle = digit(p);
            
            const float off = 0.002;
            float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                        digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                        digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
            
            vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
            return baseColor;
        }
        
        vec2 barrel(vec2 uv){
            vec2 c = uv * 2.0 - 1.0;
            float r2 = dot(c, c);
            c *= 1.0 + uCurvature * r2;
            return c * 0.5 + 0.5;
        }
        
        void main() {
            time = iTime * 0.333333;
            vec2 uv = vUv;
        
            if(uCurvature != 0.0){
                uv = barrel(uv);
            }
            
            vec2 p = uv * uScale;
            vec3 col = getColor(p);
        
            if(uChromaticAberration != 0.0){
                vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
                col.r = getColor(p + ca).r;
                col.b = getColor(p - ca).b;
            }
        
            col *= uTint;
            col *= uBrightness;
        
            if(uDither > 0.0){
                float rnd = hash21(gl_FragCoord.xy);
                col += (rnd - 0.5) * (uDither * 0.003922);
            }
        
            gl_FragColor = vec4(col, 1.0);
        }
    `;
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        let h = hex.replace("#", "").trim();
        if (h.length === 3)
            h = h.split("").map((c) => c + c).join("");
        const num = parseInt(h, 16);
        return [
            ((num >> 16) & 255) / 255,
            ((num >> 8) & 255) / 255,
            (num & 255) / 255,
        ];
    }
    
    // Configuration
    const config = {
        scale: 1.5,
        gridMul: [2, 1],
        digitSize: 1.2,
        timeScale: 1,
        pause: false,
        scanlineIntensity: 1,
        glitchAmount: 1,
        flickerAmount: 1,
        noiseAmp: 1,
        chromaticAberration: 0,
        dither: 0,
        curvature: 0,
        tint: "#ffffff",
        mouseReact: true,
        mouseStrength: 0.5,
        pageLoadAnimation: false,
        brightness: 1,
        dpr: Math.min(window.devicePixelRatio || 1, 2)
    };
    
    const tintVec = hexToRgb(config.tint);
    const ditherValue = typeof config.dither === "boolean" ? (config.dither ? 1 : 0) : config.dither;
    
    // Mouse tracking
    const mouseRef = { x: 0.5, y: 0.5 };
    const smoothMouseRef = { x: 0.5, y: 0.5 };
    const frozenTimeRef = { value: 0 };
    const loadAnimationStartRef = { value: 0 };
    const timeOffsetRef = { value: Math.random() * 100 };
    
    const handleMouseMove = (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        mouseRef.x = x;
        mouseRef.y = y;
    };
    
    // Create renderer
    const renderer = new Renderer({ dpr: config.dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    
    // Create geometry
    const geometry = new Triangle(gl);
    
    // Create program
    const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
            iTime: { value: 0 },
            iResolution: {
                value: new Color(
                    gl.canvas.width,
                    gl.canvas.height,
                    gl.canvas.width / gl.canvas.height
                ),
            },
            uScale: { value: config.scale },
            uGridMul: { value: new Float32Array(config.gridMul) },
            uDigitSize: { value: config.digitSize },
            uScanlineIntensity: { value: config.scanlineIntensity },
            uGlitchAmount: { value: config.glitchAmount },
            uFlickerAmount: { value: config.flickerAmount },
            uNoiseAmp: { value: config.noiseAmp },
            uChromaticAberration: { value: config.chromaticAberration },
            uDither: { value: ditherValue },
            uCurvature: { value: config.curvature },
            uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
            uMouse: {
                value: new Float32Array([
                    smoothMouseRef.x,
                    smoothMouseRef.y,
                ]),
            },
            uMouseStrength: { value: config.mouseStrength },
            uUseMouse: { value: config.mouseReact ? 1 : 0 },
            uPageLoadProgress: { value: config.pageLoadAnimation ? 0 : 1 },
            uUsePageLoadAnimation: { value: config.pageLoadAnimation ? 1 : 0 },
            uBrightness: { value: config.brightness },
        },
    });
    
    // Create mesh
    const mesh = new Mesh(gl, { geometry, program });
    
    // Handle resize
    function resize() {
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        program.uniforms.iResolution.value = new Color(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height
        );
    }
    
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();
    
    // Animation loop
    const update = (t) => {
        requestAnimationFrame(update);
        
        if (config.pageLoadAnimation && loadAnimationStartRef.value === 0) {
            loadAnimationStartRef.value = t;
        }
        
        if (!config.pause) {
            const elapsed = (t * 0.001 + timeOffsetRef.value) * config.timeScale;
            program.uniforms.iTime.value = elapsed;
            frozenTimeRef.value = elapsed;
        } else {
            program.uniforms.iTime.value = frozenTimeRef.value;
        }
        
        if (config.pageLoadAnimation && loadAnimationStartRef.value > 0) {
            const animationDuration = 2000;
            const animationElapsed = t - loadAnimationStartRef.value;
            const progress = Math.min(animationElapsed / animationDuration, 1);
            program.uniforms.uPageLoadProgress.value = progress;
        }
        
        if (config.mouseReact) {
            const dampingFactor = 0.08;
            smoothMouseRef.x += (mouseRef.x - smoothMouseRef.x) * dampingFactor;
            smoothMouseRef.y += (mouseRef.y - smoothMouseRef.y) * dampingFactor;
            
            const mouseUniform = program.uniforms.uMouse.value;
            mouseUniform[0] = smoothMouseRef.x;
            mouseUniform[1] = smoothMouseRef.y;
        }
        
        renderer.render({ scene: mesh });
    };
    
    requestAnimationFrame(update);
    container.appendChild(gl.canvas);
    
    if (config.mouseReact) container.addEventListener("mousemove", handleMouseMove);
    
    // Function to show/hide based on current section
    function updateFaultyTerminalVisibility() {
        const scrollPos = window.scrollY;
        const homeSection = document.getElementById('home');
        const homeHeight = homeSection ? homeSection.offsetHeight : 0;
        
        if (scrollPos < homeHeight) {
            // On home section - show FaultyTerminal
            container.style.display = 'block';
        } else {
            // On other sections - hide FaultyTerminal
            container.style.display = 'none';
        }
    }
    
    // Update visibility on scroll
    window.addEventListener('scroll', updateFaultyTerminalVisibility);
    
    // Initial visibility check
    updateFaultyTerminalVisibility();
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(update);
        resizeObserver.disconnect();
        if (config.mouseReact) container.removeEventListener("mousemove", handleMouseMove);
        if (gl.canvas.parentElement === container) {
            container.removeChild(gl.canvas);
        }
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        loadAnimationStartRef.value = 0;
        timeOffsetRef.value = Math.random() * 100;
    };
}

// Grid-based pixel trail effect for non-home sections
function createPixelTrail() {
    // Create gooey filter
    const gooeyFilter = document.createElement('svg');
    gooeyFilter.className = 'goo-filter-container';
    gooeyFilter.innerHTML = `
        <defs>
            <filter id="custom-goo-filter">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
        </defs>
    `;
    document.body.appendChild(gooeyFilter);
    
    // Create pixel grid
    const pixelGrid = document.createElement('div');
    pixelGrid.className = 'pixel-grid';
    pixelGrid.style.filter = 'url(#custom-goo-filter)';
    document.body.appendChild(pixelGrid);
    
    // Grid configuration
    const gridSize = 20;
    const trailSize = 0.1;
    const maxAge = 250;
    const interpolate = 5;
    
    // Create grid cells
    const gridCells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-pixel';
        cell.dataset.index = i;
        pixelGrid.appendChild(cell);
        gridCells.push(cell);
    }
    
    // Trail tracking
    let trail = new Array(gridSize * gridSize).fill(0);
    let lastX = 0;
    let lastY = 0;
    let isMoving = false;
    
    function getGridPosition(x, y) {
        const rect = pixelGrid.getBoundingClientRect();
        const gridX = Math.floor((x - rect.left) / rect.width * gridSize);
        const gridY = Math.floor((y - rect.top) / rect.height * gridSize);
        return { gridX, gridY };
    }
    
    function activatePixel(x, y, intensity = 1) {
        const { gridX, gridY } = getGridPosition(x, y);
        const index = gridY * gridSize + gridX;
        
        if (index >= 0 && index < gridSize * gridSize) {
            trail[index] = Math.max(trail[index], intensity);
            gridCells[index].classList.add('active');
            
            // Fade out after delay
            setTimeout(() => {
                trail[index] = Math.max(0, trail[index] - 0.1);
                if (trail[index] <= 0) {
                    gridCells[index].classList.remove('active');
                }
            }, maxAge);
        }
    }
    
    function interpolatePixels(startX, startY, endX, endY) {
        const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
        const steps = Math.max(1, Math.floor(distance / interpolate));
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            activatePixel(x, y, trailSize);
        }
    }
    
    // Track if we're hovering over interactive elements
    let isHoveringInteractive = false;
    
    // Get all interactive elements
    const interactiveElements = document.querySelectorAll('.btn, .nav-link, .project-link, .social-link, .skill-item, .contact-item, .back-to-top, a, button, input, textarea, select');
    
    // Add hover listeners to interactive elements
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            isHoveringInteractive = true;
            // Hide all active pixels
            gridCells.forEach(cell => {
                cell.classList.remove('active');
            });
            trail.fill(0);
        });
        
        element.addEventListener('mouseleave', () => {
            isHoveringInteractive = false;
        });
    });
    
    document.addEventListener('mousemove', (e) => {
        // Don't create pixels if hovering over interactive elements
        if (isHoveringInteractive) {
            return;
        }
        
        if (isMoving) {
            interpolatePixels(lastX, lastY, e.clientX, e.clientY);
        }
        
        activatePixel(e.clientX, e.clientY, trailSize);
        
        lastX = e.clientX;
        lastY = e.clientY;
        isMoving = true;
    });
    
    document.addEventListener('mouseleave', () => {
        isMoving = false;
    });
    
    document.addEventListener('mouseenter', () => {
        isMoving = false;
    });
    
    // Function to show/hide pixel trail based on current section
    function updatePixelTrailVisibility() {
        const scrollPos = window.scrollY;
        const homeSection = document.getElementById('home');
        const homeHeight = homeSection ? homeSection.offsetHeight : 0;
        
        if (scrollPos < homeHeight) {
            // On home section - hide pixel trail
            pixelGrid.style.display = 'none';
        } else {
            // On other sections - show pixel trail
            pixelGrid.style.display = 'grid';
        }
    }
    
    // Function to enable pixel trail everywhere
    function enablePixelTrailEverywhere() {
        pixelGrid.style.display = 'grid';
        // Remove the scroll listener that was hiding it on home section
        window.removeEventListener('scroll', updatePixelTrailVisibility);
    }
    
    // Function to hide pixel trail when home is active
    function hidePixelTrailOnHome() {
        const homeLink = document.querySelector('.nav-link[href="#home"]');
        if (homeLink && homeLink.classList.contains('active')) {
            pixelGrid.style.display = 'none';
        } else {
            pixelGrid.style.display = 'grid';
        }
    }
    
    // Update visibility on scroll
    window.addEventListener('scroll', updatePixelTrailVisibility);
    
    // Initial visibility check
    updatePixelTrailVisibility();
    
    // Return the enable function so it can be called from outside
    return { enablePixelTrailEverywhere, hidePixelTrailOnHome };
}

// Intro card functionality
function showIntroCard() {
    const introCard = document.getElementById('intro-card');
    const hero = document.querySelector('.hero');
    
    if (introCard && hero) {
        // Add blur to hero section
        hero.classList.add('blurred');
        
        // Show card
        introCard.style.display = 'block';
    }
}

function closeIntroCard() {
    const introCard = document.getElementById('intro-card');
    const hero = document.querySelector('.hero');
    
    if (introCard && hero) {
        // Hide card with animation
        introCard.classList.add('hidden');
        
        // Wait for card to fade out, then slowly remove blur
        setTimeout(() => {
            hero.classList.remove('blurred');
        }, 200);
        
        // Remove card after animation
        setTimeout(() => {
            introCard.style.display = 'none';
        }, 500);
    }
}

// Cursor effect card functionality
let pixelTrailController = null;

function showCursorEffectCard() {
    const cursorEffectCard = document.getElementById('cursor-effect-card');
    
    if (cursorEffectCard) {
        cursorEffectCard.style.display = 'block';
    }
}

function closeCursorEffectCard() {
    const cursorEffectCard = document.getElementById('cursor-effect-card');
    
    if (cursorEffectCard) {
        // Hide card with animation
        cursorEffectCard.classList.add('hidden');
        
        // Enable pixel trail everywhere after user closes the card
        if (pixelTrailController) {
            pixelTrailController.enablePixelTrailEverywhere();
        }
        
        // Remove card after animation
        setTimeout(() => {
            cursorEffectCard.style.display = 'none';
        }, 500);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // AGGRESSIVE: Force scroll to top immediately and repeatedly
    window.scrollTo(0, 0);
    
    // Remove any hash from URL that might cause scrolling
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    
    // Force home as active immediately
    setHomeAsActive();
    
    // Force home as active initially, then allow normal navigation
    setHomeAsActive();
    
    // Force scroll to top on page reload
    window.scrollTo(0, 0);
    
    // Remove any hash from URL that might cause scrolling
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
    
    // Additional force scroll to top
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 1000);
    
    // Enable normal scroll navigation after a short delay
    setTimeout(() => {
        window.addEventListener('scroll', updateActiveNavLink);
    }, 1000);
    
    // Show intro card
    showIntroCard();
    
    // Create both effects
    createFaultyTerminal();
    pixelTrailController = createPixelTrail();
    
    // Force AOS to reinitialize after a short delay
    setTimeout(() => {
        AOS.refresh();
    }, 100);
    
    // Initialize any additional functionality
    console.log('Artist portfolio loaded successfully!');
    
    // Additional window load event to ensure scroll to top
    window.addEventListener('load', function() {
        window.scrollTo(0, 0);
        setHomeAsActive();
        
        // Remove any hash from URL
        if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname);
        }
    });
    
    // Track if cursor effect card has been shown
    let cursorEffectCardShown = false;
    
    // Show cursor effect card when scrolling to About section for the first time
    function checkForAboutSection() {
        const aboutSection = document.getElementById('about');
        const scrollPos = window.scrollY;
        
        if (aboutSection && !cursorEffectCardShown) {
            const aboutTop = aboutSection.offsetTop;
            const aboutHeight = aboutSection.offsetHeight;
            
            // Check if we're in the About section
            if (scrollPos >= aboutTop - 100 && scrollPos < aboutTop + aboutHeight) {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    showCursorEffectCard();
                    cursorEffectCardShown = true;
                }, 500);
            }
        }
    }
    
    // Add scroll listener for cursor effect card
    window.addEventListener('scroll', checkForAboutSection);
});

// Function to set home as active by default
function setHomeAsActive() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Remove active class from ALL links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the home link
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
        console.log('Home link activated');
    } else {
        console.log('Home link not found');
    }
    
    // Force scroll to top on page reload
    window.scrollTo(0, 0);
    
    // Also prevent any hash in URL that might cause scrolling
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
    }
} 

 