declare module 'aurelia-history-browser' {
  import * as core from 'core-js';
  import { History }  from 'aurelia-history';
  
  /**
   * An implementation of the basic history api.
   */
  export class BrowserHistory extends History {
    
    /**
       * Creates an instance of BrowserHistory.
       */
    constructor();
    getHash(window?: Window): string;
    getFragment(fragment: string, forcePushState?: boolean): string;
    
    /**
       * Activates the history object.
       * @param options The set of options to activate history with.
       */
    activate(options?: Object): boolean;
    
    /**
       * Deactivates the history object.
       */
    deactivate(): void;
    checkUrl(): boolean;
    loadUrl(fragmentOverride: string): boolean;
    
    /**
       * Causes a history navigation to occur.
       * @param fragment The history fragment to navigate to.
       * @param options The set of options that specify how the navigation should occur.
       */
    navigate(fragment?: string, options?: Object): boolean;
    
    /**
       * Causes the history state to navigate back.
       */
    navigateBack(): void;
  }
  
  /**
   * Configures the plugin by registering BrowserHistory as the implementor of History in the DI container.
   */
  export function configure(config: Object): void;
}