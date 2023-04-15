class Model {
    constructor(options) {
        this.mixers = [];
        this.clock = new THREE.Clock();
        this.player = null;
        this.mixers = [];
        this.scene = new THREE.Scene();
        this.scene.add(new THREE.AmbientLight(0xFFFFFF));
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(-5, 3, 10);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.position = 'absolute';
        options.container.appendChild(this.renderer.domElement);
        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 20, 10);
        this.scene.add(dirLight);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);
        const control = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.render();
    }
    render() {
        window.requestAnimationFrame(() => {
            this.render();
        });
        for (const mixer of this.mixers) {
            mixer.update(this.clock.getDelta());
        }
        this.renderer.render(this.scene, this.camera);
    }
    loadModel(setting, callback) {
        const loader = this.getLoader(setting.modelUrl);
        if (loader == null) {
            console.info('未找到相应模型加载器');
            return;
        }
        loader.load(setting.modelUrl, (obj) => {
            this.addModel(obj, setting);
        }, (e) => {
            callback(e);
        }, (err) => {
            console.error('加载模型错误:', err);
        });
    }
    getLoader(modelUrl) {
        let loader = null;
        const suffix = modelUrl.split('.').pop().toUpperCase();
        switch (suffix) {
            case 'FBX':
                loader = new THREE.FBXLoader();
                break;
            case 'GLTF':
            case 'GLB':
                loader = new THREE.GLTFLoader();
                break;
        }
        return loader;
    }
    addModel(obj, setting) {
        this.player = obj.scene || obj;
        console.info(this.player);
        this.player.scale.setScalar(setting.scale);
        if (setting.position) {
            this.player.position.set(setting.position[0], setting.position[1], setting.position[2]);
        }
        this.scene.add(this.player);
        if (obj.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(this.player);
            mixer.clipAction(obj.animations[setting.clipAction]).play();
            this.mixers.push(mixer);
        }
    }
    removeModel() {
        if (!this.player) {
            return;
        }
        this.scene.remove(this.player);
        this.player = null;
        this.mixers = [];
    }
}
