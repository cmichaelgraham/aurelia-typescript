declare module 'aurelia-animator-css' {
  import { animationEvent, Animator }  from 'aurelia-templating';
  export interface CssAnimation {
    className: string;
    element: HTMLElement;
  }
  
  /**
   * Aurelia animator implementation using CSS3-Animations
   */
  export class CssAnimator {
    constructor();
    
    /* Public API Begin */
    /**
       * Run an animation for the given element/elements with the specified className in parallel
       *
       * @param element   the element/s to be animated
       * @param className the class to be added and removed
       * @returns
       */
    animate(element: HTMLElement | Array<HTMLElement>, className: string): Promise<boolean>;
    
    /**
       * Runs a series of animations in sequence
       *
       * @param animations array of animation parameters
       * @returns
       */
    runSequence(animations: Array<CssAnimation>): Promise<boolean>;
    
    /**
       * Stub of move interface method
       *
       * @returns
       */
    move(): Promise<boolean>;
    
    /**
       * Performs the enter animation for the given element, triggered by a [my-class]-enter-active css-class
       *
       * @param element the element to be animated
       *
       * @returns
       */
    enter(element: HTMLElement): Promise<boolean>;
    
    /**
       * Performs the leave animation for the given element, triggered by a [my-class]-leave-active css-class
       *
       * @param element the element to be animated
       *
       * @returns
       */
    leave(element: HTMLElement): Promise<boolean>;
    
    /**
       * Executes an animation by removing a css-class
       *
       * @param element        he element to be animated
       * @param className      css-class to be removed
       * @param suppressEvents suppress event triggering
       *
       * @returns
       */
    removeClass(element: HTMLElement, className: string, suppressEvents?: boolean): Promise<boolean>;
    
    /**
       * Executes an animation by adding a css-class
       *
       * @param element        the element to be animated
       * @param className      css-class to be removed
       * @param suppressEvents suppress event triggering
       *
       * @returns
       */
    addClass(element: HTMLElement, className: string, suppressEvents?: boolean): Promise<boolean>;
  }
  
  /* Public API End */
  export function configure(config: Object, callback?: ((animator: CssAnimator) => void)): any;
}