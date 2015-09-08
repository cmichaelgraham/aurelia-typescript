import {Router} from 'aurelia-router';

export class App {
	router:Router;

  configureRouter(config, router:Router){
    config.title = 'Aurelia';
    config.map([
      { route: ['','welcome'],  moduleId: './welcome', nav: true, title: 'Welcome' },
      { route: 'employees', moduleId: './employee/employee-list', nav: true, title: 'Employees' },
      { route: 'image-test', moduleId: './employee/image-test', nav: true, title: 'Image Test' }
    ]);

    this.router = router;
  }
}
