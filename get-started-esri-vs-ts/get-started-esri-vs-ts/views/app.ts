import {RouterConfiguration, Router} from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: 'views/welcome', nav: true, title: 'Welcome' }
        ]);

        this.router = router;
    }
}