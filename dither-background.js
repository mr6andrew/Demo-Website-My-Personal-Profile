// Dither Background for Personal Website
class DitherBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            waveColor: options.waveColor || [0.5, 0.5, 0.5],
            waveSpeed: options.waveSpeed || 0.05,
            waveFrequency: options.waveFrequency || 3,
            waveAmplitude: options.waveAmplitude || 0.3,
            colorNum: options.colorNum || 4,
            pixelSize: options.pixelSize || 2,
            enableMouseInteraction: options.enableMouseInteraction !== false,
            mouseRadius: options.mouseRadius || 0.3
        };
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
        this.camera.position.z = 1;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                waveSpeed: { value: this.options.waveSpeed },
                waveFrequency: { value: this.options.waveFrequency },
                waveAmplitude: { value: this.options.waveAmplitude },
                waveColor: { value: new THREE.Color(...this.options.waveColor) },
                mousePos: { value: new THREE.Vector2(0, 0) },
                enableMouseInteraction: { value: this.options.enableMouseInteraction ? 1 : 0 },
                mouseRadius: { value: this.options.mouseRadius },
                colorNum: { value: this.options.colorNum },
                pixelSize: { value: this.options.pixelSize }
            }
        });
        
        // Create mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation
        this.animate();
    }
    
    getVertexShader() {
        return `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;
    }
    
    getFragmentShader() {
        return `
            precision highp float;
            uniform float time;
            uniform vec2 resolution;
            uniform float waveSpeed;
            uniform float waveFrequency;
            uniform float waveAmplitude;
            uniform vec3 waveColor;
            uniform vec2 mousePos;
            uniform int enableMouseInteraction;
            uniform float mouseRadius;
            uniform float colorNum;
            uniform float pixelSize;
            
            vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
            
            float cnoise(vec2 P) {
                vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
                vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
                Pi = mod289(Pi);
                vec4 ix = Pi.xzxz;
                vec4 iy = Pi.yyww;
                vec4 fx = Pf.xzxz;
                vec4 fy = Pf.yyww;
                vec4 i = permute(permute(ix) + iy);
                vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
                vec4 gy = abs(gx) - 0.5;
                vec4 tx = floor(gx + 0.5);
                gx = gx - tx;
                vec2 g00 = vec2(gx.x, gy.x);
                vec2 g10 = vec2(gx.y, gy.y);
                vec2 g01 = vec2(gx.z, gy.z);
                vec2 g11 = vec2(gx.w, gy.w);
                vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
                g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
                float n00 = dot(g00, vec2(fx.x, fy.x));
                float n10 = dot(g10, vec2(fx.y, fy.y));
                float n01 = dot(g01, vec2(fx.z, fy.z));
                float n11 = dot(g11, vec2(fx.w, fy.w));
                vec2 fade_xy = fade(Pf.xy);
                vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
                return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
            }
            
            const int OCTAVES = 4;
            float fbm(vec2 p) {
                float value = 0.0;
                float amp = 1.0;
                float freq = waveFrequency;
                for (int i = 0; i < OCTAVES; i++) {
                    value += amp * abs(cnoise(p));
                    p *= freq;
                    amp *= waveAmplitude;
                }
                return value;
            }
            
            float pattern(vec2 p) {
                vec2 p2 = p - time * waveSpeed;
                return fbm(p + fbm(p2)); 
            }
            
            vec3 dither(vec2 uv, vec3 color) {
                vec2 scaledCoord = floor(uv * resolution / pixelSize);
                int x = int(mod(scaledCoord.x, 8.0));
                int y = int(mod(scaledCoord.y, 8.0));
                float threshold = 0.0;
                if (y == 0) threshold = float(x) / 8.0;
                else if (y == 1) threshold = (float(x) + 8.0) / 16.0;
                else if (y == 2) threshold = (float(x) + 4.0) / 16.0;
                else if (y == 3) threshold = (float(x) + 12.0) / 16.0;
                else if (y == 4) threshold = (float(x) + 2.0) / 16.0;
                else if (y == 5) threshold = (float(x) + 10.0) / 16.0;
                else if (y == 6) threshold = (float(x) + 6.0) / 16.0;
                else if (y == 7) threshold = (float(x) + 14.0) / 16.0;
                
                threshold = threshold - 0.25;
                float step = 1.0 / (colorNum - 1.0);
                color += threshold * step;
                float bias = 0.2;
                color = clamp(color - bias, 0.0, 1.0);
                return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
            }
            
            void main() {
                vec2 uv = gl_FragCoord.xy / resolution.xy;
                uv -= 0.5;
                uv.x *= resolution.x / resolution.y;
                float f = pattern(uv);
                
                if (enableMouseInteraction == 1) {
                    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
                    mouseNDC.x *= resolution.x / resolution.y;
                    float dist = length(uv - mouseNDC);
                    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
                    f -= 0.5 * effect;
                }
                
                vec3 col = mix(vec3(0.0), waveColor, f);
                col = dither(uv, col);
                gl_FragColor = vec4(col, 1.0);
            }
        `;
    }
    
    addEventListeners() {
        // Mouse move
        window.addEventListener('mousemove', (e) => {
            if (this.options.enableMouseInteraction) {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.mesh.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // 60fps
        
        // Update uniforms
        this.mesh.material.uniforms.time.value = this.time;
        this.mesh.material.uniforms.mousePos.value.set(this.mouse.x, this.mouse.y);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }
    }
} 