/**
 * An implementation of the templating engine's BindingLanguage abstraction which
 * uses a pluggable command syntax.
 */
declare module 'aurelia-templating-binding' {
  import {BindingLanguage} from 'aurelia-templating';
  
  /**
   * Aurelia's pluggable command syntax.
   */
  export class SyntaxInterpreter {
  }
  
  /**
   * An implementation of Aurelia's binding language
   */
  export class TemplatingBindingLanguage extends BindingLanguage {
  }
}