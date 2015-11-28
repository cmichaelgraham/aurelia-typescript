declare module 'aurelia-bootstrapper' {
  import 'core-js';
  import { PLATFORM }  from 'aurelia-pal';
  import { initialize }  from 'aurelia-pal-browser';
  
  /**
   * Manually bootstraps an application.
   * @param configure A callback which passes an Aurelia instance to the developer to manually configure and start up the app.
   * @return A Promise that completes when configuration is done.
   */
  export function bootstrap(configure: Function): Promise<void>;
}