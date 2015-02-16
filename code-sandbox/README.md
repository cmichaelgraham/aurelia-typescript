# Aurelia Code Sandbox

> A place to illustate code usage

## Table of Contents

1. [Quick Start Instructions](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#quick-start-instructions)
1. [Child VM](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#creating-a-vm-that-has-a-property-that-is-an-object-like-a-child-vm)
2. [Dynamic Routes](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#adding-a-route-dynamically)
3. [Wizard & Routing](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/README.md#wizard-routing-sample)

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
