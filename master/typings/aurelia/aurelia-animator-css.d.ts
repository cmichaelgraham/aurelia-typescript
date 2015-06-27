declare module 'aurelia-animator-css/animator' {
	export class CssAnimator {
	    animationStack: any;
	    constructor();
	    addMultipleEventListener(el: any, s: any, fn: any, b: any): void;
	    addAnimationToStack(animId: any): void;
	    removeAnimationFromStack(animId: any): void;
	    getElementAnimationDelay(element: any): number;
	    move(): Promise<boolean>;
	    enter(element: any): Promise<{}>;
	    leave(element: any): Promise<{}>;
	    removeClass(element: any, className: any): Promise<{}>;
	    addClass(element: any, className: any): Promise<{}>;
        animate(element: any, className:any , options:any): Promise<{}>;
        runSequence(sequence:any): Promise<{}>;
        registerEffect(effectName : string, properties: any): Promise<boolean>;
        unregisterEffect(effectName : string): Promise<boolean>;
        
	}

}
declare module 'aurelia-animator-css/index' {
	export { CssAnimator } from 'aurelia-animator-css/animator';
	export function configure(aurelia: any): void;

}
declare module 'aurelia-animator-css' {
	export * from 'aurelia-animator-css/index';
}
