declare module 'aurelia-animator-css/animator' {
	export class CssAnimator {
	   animationStack: any;
	    constructor();
	    addMultipleEventListener(el: any, s: any, fn: any): void;
	    addAnimationToStack(animId: any): void;
	    removeAnimationFromStack(animId: any): void;
		getElementAnimationDelay(element: any): any;
		performSingleAnimate(element: any, className: any): Promise<{}>;
		triggerDOMEvent(eventType: any, element: any): void;
		animate(element: any, className: any): any;		
		runSequence(animations:any): Promise<{}>;  		    
	    move(): Promise<boolean>;
	    enter(element: any): Promise<{}>;
	    leave(element: any): Promise<{}>;
	    removeClass(element: any, className: any): Promise<{}>;
	    addClass(element: any, className: any): Promise<{}>;       
	}
}
declare module 'aurelia-animator-css/index' {
	export { CssAnimator } from 'aurelia-animator-css/animator';
	export function configure(aurelia: any): void;
}
declare module 'aurelia-animator-css' {
	export * from 'aurelia-animator-css/index';
}
