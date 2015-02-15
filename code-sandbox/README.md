# Aurelia Code Sandbox

> A place to illustate code usage

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

