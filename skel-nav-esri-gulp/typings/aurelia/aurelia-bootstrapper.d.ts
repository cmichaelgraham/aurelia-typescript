declare module 'aurelia-bootstrapper' {
  
  /*eslint no-unused-vars:0*/
  import core from 'core-js';
  import { Aurelia, LogManager }  from 'aurelia-framework';
  export function bootstrap(configure: ((aurelia: Aurelia) => void)): Promise<void>;
}