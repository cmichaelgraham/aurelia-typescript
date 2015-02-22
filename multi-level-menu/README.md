# Multi-Level Menu

## Overview

The multi-level menu sample shows how you can quickly create a hierarchical menu when building an Aurelia SPA website.

The multi-level menu helps users navigate through a hierarchy of pages.

![multi-level-menu working](https://cloud.githubusercontent.com/assets/10272832/6319803/fa044570-ba87-11e4-8912-2cb9286ee089.png)

This menu structure and its associated router navigation is easy to configure:

```javascript
import aur = require("aurelia-router");
import mlmps = require("./MultiLevelMenuPipelineStep");

export class App {
    static inject = [aur.Router];

    constructor(public router: aur.Router) {
        this.router.configure((config) => {
            config.title = "Aurelia VS/TS";
            config.addPipelineStep("modelbind", mlmps.MultiLevelMenuPipelineStep);
            config.map([
                { route: ["", "home"], moduleId: "views/home", nav: true, title: "home", settings: { level: 0, show: true } },
                { route: ["item-1"], moduleId: "views/item-1", nav: true, title: "item 1", settings: { level: 0, show: true } },
                { route: ["item-1-1"], moduleId: "views/item-1-1", nav: true, title: "item 1.1", settings: { level: 1, show: false } },
                { route: ["item-1-2"], moduleId: "views/item-1-2", nav: true, title: "item 1.2", settings: { level: 1, show: false } },
                { route: ["item-2"], moduleId: "views/item-2", nav: true, title: "item 2", settings: { level: 0, show: true } },
                { route: ["item-2-1"], moduleId: "views/item-2-1", nav: true, title: "item 2.1", settings: { level: 1, show: false } },
                { route: ["item-2-2"], moduleId: "views/item-2-2", nav: true, title: "item 2.2", settings: { level: 1, show: false } },
                { route: ["item-2-2-1"], moduleId: "views/item-2-2-1", nav: true, title: "item 2.2.1", settings: { level: 2, show: false } },
                { route: ["item-2-2-2"], moduleId: "views/item-2-2-2", nav: true, title: "item 2.2.2", settings: { level: 2, show: false } },
                { route: ["item-2-3"], moduleId: "views/item-2-3", nav: true, title: "item 2.3", settings: { level: 1, show: false } }
            ]);
        });
    }
}
```

The `level` property is used to establish the hierarchy.  The `show` property controls the visibility of the route in the menu.  The router navigation pipeline step looks at the target navigation and sets the route visiblity accordingly.  The navigation helper provides a button to navigate up a level from the current route, and invokes the corresponding navigation commmand to the router.

## Quick Start

3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
1. run visual studio
2. open solution in `multi-level-menu`
3. run solution using chrome

## Technical Implementation

The `level` property is used to establish the hierarchy.  The `show` property controls the visibility of the route in the menu.  The router navigation pipeline step looks at the target navigation and sets the route visiblity accordingly.  The navigation helper provides a button to navigate up a level from the current route, and invokes the corresponding navigation commmand to the router.

### [Router Pipeline Navigation Step]()

[The step is a class](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/MultiLevelMenuPipelineStep.ts).
The step is [added to the router configuration](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/app.ts#L10).

There is not much to the code for the step.  Most of the work is delegated to the utility functions.

```javascript
import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import mlmu = require("./MultiLevelMenuUtil");

export class MultiLevelMenuPipelineStep {
    run(routingContext: aur.NavigationContext, next: { (): void; cancel(): void; }) {
        var targetRouteIndex = mlmu.MultiLevelMenuUtil.getTargetRouteIndex(routingContext.router, routingContext.plan.default.config.moduleId);
        mlmu.MultiLevelMenuUtil.setForTarget(routingContext.router, targetRouteIndex);
        return next();
    }
}
```


### Navigation Helper - Custom Element

[navigation helper view](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/multi-level-menu-helper.html)

```html
<template>
    <button class="btn btn-info" click.delegate="navigateUp()">------^------</button>
</template>
```

[navigation helper view model](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/multi-level-menu-helper.ts)

```javascript
import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import mlmu = require("./MultiLevelMenuUtil");

export class MultiLevelMenuHelper {

    public router: aur.Router;

    static metadata = auf.Behavior.withProperty("router");

    navigateUp() {
        mlmu.MultiLevelMenuUtil.goUp(this.router);
    }
}
```

### [Utility Functions](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/MultiLevelMenuUtil.ts)

### code to [add a step to the router pipeline](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/multi-level-menu/multi-level-menu/views/app.ts#L10)
