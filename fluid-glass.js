// FluidGlass 3D Cursor Effect - Following exact specifications
class FluidGlass {
    constructor(options = {}) {
        this.mode = options.mode || "lens";
        this.lensProps = options.lensProps || {
            scale: 0.25,
            ior: 1.15,
            thickness: 5,
            chromaticAberration: 0.1,
            anisotropy: 0.01
        };
        this.barProps = options.barProps || {};
        this.cubeProps = options.cubeProps || {};
        
        this.canvas = document.getElementById('fluid-glass-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.mouse = { x: 0, y: 0 };
        this.isOnHomePage = false;
        
        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera - positioned to see the cursor area
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 3;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);

        // Create geometry based on mode
        let geometry;
        switch(this.mode) {
            case "lens":
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case "bar":
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
                break;
            case "cube":
                geometry = new THREE.BoxGeometry(1, 1, 1);
                break;
            default:
                geometry = new THREE.SphereGeometry(1, 32, 32);
        }
        
        // Glass material with exact properties from specifications
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 0.1,
            metalness: 0.9,
            ior: this.lensProps.ior || 1.15,
            thickness: this.lensProps.thickness || 5,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1
        });

        this.mesh = new THREE.Mesh(geometry, material);
        
        // Apply scale based on mode and props
        const scale = this.getScale();
        this.mesh.scale.setScalar(scale);
        
        this.scene.add(this.mesh);

        // Add environment map for reflections
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        const envTexture = pmremGenerator.fromScene(new THREE.Scene()).texture;
        material.envMap = envTexture;
        pmremGenerator.dispose();

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Add point light for glow effect
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 5);
        this.scene.add(pointLight);
    }

    getScale() {
        switch(this.mode) {
            case "lens":
                return this.lensProps.scale || 0.25;
            case "bar":
                return this.barProps.scale || 0.3;
            case "cube":
                return this.cubeProps.scale || 0.2;
            default:
                return 0.25;
        }
    }

    setupEventListeners() {
        // Mouse move - stick to cursor exactly
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Scroll to check if on home page
        window.addEventListener('scroll', () => {
            this.checkHomePage();
        });
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

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.isOnHomePage && this.mesh) {
            // Stick to cursor exactly - convert screen coordinates to world coordinates
            const vector = new THREE.Vector3();
            vector.set(
                (this.mouse.x * window.innerWidth) / window.innerWidth * 2 - 1,
                -(this.mouse.y * window.innerHeight) / window.innerHeight * 2 + 1,
                0.5
            );
            vector.unproject(this.camera);
            const dir = vector.sub(this.camera.position).normalize();
            const distance = -this.camera.position.z / dir.z;
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
            
            // Smooth following with exact cursor position
            this.mesh.position.x = THREE.MathUtils.lerp(this.mesh.position.x, pos.x, 0.15);
            this.mesh.position.y = THREE.MathUtils.lerp(this.mesh.position.y, pos.y, 0.15);

            // 3D rotation based on mouse position
            this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, this.mouse.y * 0.5, 0.1);
            this.mesh.rotation.y = THREE.MathUtils.lerp(this.mesh.rotation.y, this.mouse.x * 0.5, 0.1);

            // Pulsing animation
            const time = Date.now() * 0.001;
            const scale = this.getScale() * (1 + Math.sin(time * 2) * 0.05);
            this.mesh.scale.setScalar(scale);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize FluidGlass with exact specifications
document.addEventListener('DOMContentLoaded', () => {
    new FluidGlass({
        mode: "lens",
        lensProps: {
            scale: 0.25,
            ior: 1.15,
            thickness: 5,
            chromaticAberration: 0.1,
            anisotropy: 0.01
        },
        barProps: {},
        cubeProps: {}
    });
}); 