﻿import {Router} from "aurelia-router";

export class App {

    router: Router;

    configureRouter(config, router: Router) {
        this.router = router;
        config.title = "Aurelia demo";
        config.map([
            { route: ["", "home"], moduleId: "views/home", nav: true, title: "home" },
            { route: "login", moduleId: "views/login", nav: false, title: "login" },
            { route: "test", moduleId: "views/nav-test/nav-test", nav: true, title: "navigation test" },
            { route: "flickr", moduleId: "views/flickr/flickr", nav: true, title: "flickr" },
            { route: "admin", moduleId: "views/admin/admin", nav: true, title: "admin" }
        ]);
    };
}