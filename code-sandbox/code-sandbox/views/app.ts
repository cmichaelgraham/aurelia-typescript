import {Router} from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config, router: Router) {
        config.title = 'Aurelia';
        config.map([
            { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to Code Sandbox" },
            { route: "child-vm", moduleId: "views/child-vm", nav: true, title: "Child VM" },
            { route: "wizard", moduleId: "views/wiz/wizard", nav: true, title: "Wizard" },
            { route: "aurelia-cube", moduleId: "views/aurelia-cube", nav: true, title: "Aurelia Cube" }
            ,{ route: "wizard2", moduleId: "views/wiz2/wizard", nav: true, title: "Wizard2" }
        ]);

        this.router = router;
    }
}
