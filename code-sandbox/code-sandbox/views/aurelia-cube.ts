import THREE = require("three");

export class AureliaCube {

    public camera: THREE.Camera;
    public scene: THREE.Scene;
    public renderer: THREE.Renderer;
    public mesh: THREE.Mesh;
    public sceneDiv: HTMLDivElement;

    public attached() {
        this.init();
        this.animate();
    }

    public init = () => {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, this.sceneDiv.offsetWidth / this.sceneDiv.offsetHeight, 1, 1000);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 1, 1).normalize();
        this.scene.add(light);

        var geometry = new THREE.BoxGeometry(30, 30, 30);
        // var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
        var material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('/images/aurelia-logo.png') });


        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = -50;
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.sceneDiv.offsetWidth, this.sceneDiv.offsetHeight);
        this.sceneDiv.appendChild(this.renderer.domElement);

        //window.addEventListener('resize', this.onWindowResize, false);

        this.render();
    }

    public animate = () => {
        this.mesh.rotation.x += .01;
        this.mesh.rotation.y += .005;

        this.render();
        requestAnimationFrame(this.animate);
    }

    public render = () => {
        this.renderer.render(this.scene, this.camera);
    }

    public onWindowResize() {
        //this.camera.aspect = window.innerWidth / window.innerHeight;
        //this.camera.updateProjectionMatrix();
        //this.renderer.setSize(window.innerWidth, window.innerHeight);
        //this.render();
    }
} 