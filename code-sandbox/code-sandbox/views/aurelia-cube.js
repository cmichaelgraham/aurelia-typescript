define(["require", "exports", "three"], function (require, exports, THREE) {
    var AureliaCube = (function () {
        function AureliaCube() {
            var _this = this;
            this.init = function () {
                _this.scene = new THREE.Scene();
                _this.camera = new THREE.PerspectiveCamera(70, _this.sceneDiv.offsetWidth / _this.sceneDiv.offsetHeight, 1, 1000);
                var light = new THREE.DirectionalLight(0xffffff);
                light.position.set(0, 1, 1).normalize();
                _this.scene.add(light);
                var geometry = new THREE.BoxGeometry(30, 30, 30);
                // var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
                var material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('/images/aurelia-logo.png') });
                _this.mesh = new THREE.Mesh(geometry, material);
                _this.mesh.position.z = -50;
                _this.scene.add(_this.mesh);
                _this.renderer = new THREE.WebGLRenderer({ alpha: true });
                _this.renderer.setSize(_this.sceneDiv.offsetWidth, _this.sceneDiv.offsetHeight);
                _this.sceneDiv.appendChild(_this.renderer.domElement);
                //window.addEventListener('resize', this.onWindowResize, false);
                _this.render();
            };
            this.animate = function () {
                _this.mesh.rotation.x += .01;
                _this.mesh.rotation.y += .005;
                _this.render();
                requestAnimationFrame(_this.animate);
            };
            this.render = function () {
                _this.renderer.render(_this.scene, _this.camera);
            };
        }
        AureliaCube.prototype.attached = function () {
            this.init();
            this.animate();
        };
        AureliaCube.prototype.onWindowResize = function () {
            //this.camera.aspect = window.innerWidth / window.innerHeight;
            //this.camera.updateProjectionMatrix();
            //this.renderer.setSize(window.innerWidth, window.innerHeight);
            //this.render();
        };
        return AureliaCube;
    })();
    exports.AureliaCube = AureliaCube;
});
//# sourceMappingURL=aurelia-cube.js.map