/**
 * Determines if the provided object is a navigation command.
 * A navigation command is anything with a navigate method.
 * @param {object} obj The item to check.
 * @return {boolean}
 */
export declare function isNavigationCommand(obj: any): boolean;
/**
* Used during the activation lifecycle to cause a redirect.
*
* @class Redirect
* @constructor
* @param {String} url The url to redirect to.
*/
export declare class Redirect {
    url: any;
    shouldContinueProcessing: any;
    router: any;
    constructor(url: any);
    /**
    * Called by the activation system to set the child router.
    *
    * @method setRouter
    * @param {Router} router
    */
    setRouter(router: any): void;
    /**
    * Called by the navigation pipeline to navigate.
    *
    * @method navigate
    * @param {Router} appRouter - a router which should redirect
    */
    navigate(appRouter: any): void;
}
