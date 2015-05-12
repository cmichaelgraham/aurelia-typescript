import {Router} from 'aurelia-router';

export class ChildRouter{
  heading = 'Child Router';
  router:Router;

  configureRouter(config, router:Router){
    config.map([
      { route: ['','welcome'],  moduleId: './welcome',      nav: true, title:'Welcome' },
      { route: 'flickr',        moduleId: './flickr',       nav: true, title:'Flickr' },
      { route: 'child-router',  moduleId: './child-router', nav: true, title:'Child Router' }
    ]);

    this.router = router;
  }
}
