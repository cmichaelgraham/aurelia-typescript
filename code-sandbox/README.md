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
