//import 'bootstrap';
//import 'bootstrap/css/bootstrap.css!';

export class App {
    router;
  configureRouter(config, router){
    config.title = 'Aurelia';
    config.map([
      { route: ['','layout'],  moduleId: 'views/layout',      nav: true, title:'Compose' },
      { route: ['html','html-render'],  moduleId: 'views/html-render',      nav: true, title:'HTML Render' },
      { route: ['content-selectors'],  moduleId: 'views/content-selectors',      nav: true, title:'Content Selectors' },
      { route: ['modal'],  moduleId: 'views/modal/index',      nav: true, title:'Modal sample' },
      { route: ['sharedstate'],  moduleId: 'views/sharing-state/index',      nav: true, title:'Shared state' }
    ]);

    this.router = router;
  }
}
