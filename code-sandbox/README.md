# Aurelia Code Sandbox

> A place to illustate code usage

## Table of Contents

1. [Quick Start Instructions](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#quick-start-instructions)
1. [Child VM](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#creating-a-vm-that-has-a-property-that-is-an-object-like-a-child-vm)
2. [Dynamic Routes](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#adding-a-route-dynamically)
3. [Wizard & Routing](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/README.md#wizard-routing-sample)
4. [aurelia cube using threejs](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/README.md#aurelia-cube-using-threejs)

## Quick Start Instructions

3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
1. run visual studio
2. open solution in `code-sandbox`
3. run solution using chrome

## Creating a VM that has a property that is an object, like a child VM

Files:

1. [child-vm.html](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/child-vm.html)

    ```html
    <template>
        <section>
            <h2>child-vm code sample</h2>
            <h2>my name is ${myChild.name}</h2>
        </section>
    </template>
    ```

2. [child-vm.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/child-vm.ts)

    ```javascript
    import m = require("views/my-child-vm");

    export class ChildVM {
        public myChild: m.MyChildVM;

        constructor() {
            this.myChild = new m.MyChildVM("jhonny");
        }
    }
    ```

3. [my-child-vm.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/my-child-vm.ts)

    ```javascript
    export class MyChildVM {
        public name: string;

        constructor(name: string) {
            this.name = name;
        }
    }
    ```

## Adding a Route Dynamically

Files:

1. [in welcome.html](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/welcome.html#L20-L21)

    > button to add dynamic route
    
    ```html
    <h2>Dynamic Route</h2>
    <button click.delegate="addDynamicRoute()">Add Dynamic Route</button>
    ```

2. [welcome.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/welcome.ts#L22-L25)

    > welcome view model handler to add dynamic route
    
    ```javascript
    addDynamicRoute() {
        this.theRouter.addRoute({ route: "dyno-view", moduleId: "views/dyno-view", nav: true, title: "dyno-view" });
        this.theRouter.refreshNavigation();
    }
    ```

3. [dyno-view.html](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/dyno-view.html)

    ```html
    <template>
        <section>
            <h2>dyno-view</h2>
        </section>
    </template>
    ```

4. [dyno-view.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/dyno-view.ts)

    ```javascript
    export class DynoView {} 
    ```

## [Wizard Routing Sample](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox/code-sandbox/views/wiz)

![wizard working](https://cloud.githubusercontent.com/assets/10272832/6210087/55e374fa-b589-11e4-804f-e3b6f4f8683a.png)

1. [wizard navigation](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/wiz/wizard.ts#L19-L43)

    ```javascript
    getActiveRouteIndex() {
        for (var routeIndex in this.router.navigation) {
            var route = this.router.navigation[routeIndex];
            if (route.isActive) {
                return routeIndex;
            }
        }
    }

    next() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex < this.router.navigation.length - 1) {
            currentIndex++;
            this.router.navigate(this.router.navigation[currentIndex].config.route, true);
        }
    }

    prev() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex > 0) {
            currentIndex--;
            this.router.navigate(this.router.navigation[currentIndex].config.route, true);
        }
    }
    ```
    
2. [wizard template](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/wiz/wizard.html)

    ```html
    <template>
        <section>
            <h1>wizard</h1>
            <div>
                <div class="col-md-2">
                    <ul class="well nav nav-pills nav-stacked">
                        <li repeat.for="row of router.navigation" class="${row.isActive ? 'active' : ''}">
                            <a href.bind="row.href">${row.title}</a>
                        </li>
                    </ul>
                </div>
                <button click.delegate="prev()" class="col-md-1"><</button>
                <div class="col-md-8">
                    <router-view></router-view>
                </div>
                <button click.delegate="next()" class="col-md-1">></button>
            </div>
        </section>
    </template>
    ```

## aurelia cube using threejs

> [view video](https://www.youtube.com/watch?v=f-NVk6wTPy4&feature=youtu.be)

1. [view: aurelia-cube.html](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/aurelia-cube.html)

    ```html
    <template>
        <section>
            <h2>aurelia cube</h2>
            <div ref="sceneDiv" style="width: 500px; height: 400px;"></div>
        </section>
    </template>
    ```

2. [view model: aurelia-cube.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/code-sandbox/views/aurelia-cube.ts)

    ```javascript
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
            var material = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('/images/aurelia-logo.png') });


            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.position.z = -50;
            this.scene.add(this.mesh);

            this.renderer = new THREE.WebGLRenderer({ alpha: true });
            this.renderer.setSize(this.sceneDiv.offsetWidth, this.sceneDiv.offsetHeight);
            this.sceneDiv.appendChild(this.renderer.domElement);

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
    }
    ```
