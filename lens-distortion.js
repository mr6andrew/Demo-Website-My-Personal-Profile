// Simple Lens Distortion Effect - Performance Optimized
class LensDistortion {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.isOnHomePage = false;
        this.animationId = null;
        
        this.init();
        this.setupEventListeners();
        this.render();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '5';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.opacity = '0';
        this.canvas.style.transition = 'opacity 0.3s ease';
        
        // Add to hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.appendChild(this.canvas);
        }

        // Setup 2D context (much faster than WebGL for this effect)
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Canvas 2D not supported');
            return;
        }

        this.resize();
    }

    setupEventListeners() {
        // Mouse move
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = event.clientX;
            this.mouse.y = event.clientY;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });

        // Scroll to check if on home page
        window.addEventListener('scroll', () => {
            this.checkHomePage();
        });
        
        // Initial check
        this.checkHomePage();
    }

    checkHomePage() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const rect = heroSection.getBoundingClientRect();
            this.isOnHomePage = rect.top <= 0 && rect.bottom >= window.innerHeight;
            
            if (this.isOnHomePage) {
                this.canvas.style.opacity = '1';
            } else {
                this.canvas.style.opacity = '0';
            }
        }
    }

    resize() {
        if (!this.canvas) return;
        
        const displayWidth = this.canvas.clientWidth;
        const displayHeight = this.canvas.clientHeight;
        
        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
    }

    render() {
        if (!this.ctx || !this.isOnHomePage) {
            this.animationId = requestAnimationFrame(() => this.render());
            return;
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Create lens distortion effect using 2D canvas
        const centerX = this.mouse.x || this.canvas.width / 2;
        const centerY = this.mouse.y || this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.15;
        
        // Create gradient for lens effect
        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        
        // Add rainbow colors to gradient
        gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');    // Red
        gradient.addColorStop(0.2, 'rgba(255, 165, 0, 0.3)'); // Orange
        gradient.addColorStop(0.4, 'rgba(255, 255, 0, 0.3)'); // Yellow
        gradient.addColorStop(0.6, 'rgba(0, 255, 0, 0.3)');   // Green
        gradient.addColorStop(0.8, 'rgba(0, 0, 255, 0.3)');   // Blue
        gradient.addColorStop(1, 'rgba(128, 0, 128, 0.3)');   // Purple

        // Draw lens effect
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Add glow effect
        this.ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;

        // Add pulsing animation
        const time = Date.now() * 0.001;
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        
        // Draw inner circle with pulse
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.3 * pulse, 0, Math.PI * 2);
        this.ctx.fill();

        this.animationId = requestAnimationFrame(() => this.render());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize lens distortion effect
let lensDistortion = null;
document.addEventListener('DOMContentLoaded', () => {
    lensDistortion = new LensDistortion();
}); 