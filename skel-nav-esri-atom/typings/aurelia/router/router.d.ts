import { NavigationContext } from './navigation-context';
export declare class Router {
    container: any;
    history: any;
    viewPorts: any;
    baseUrl: any;
    isConfigured: any;
    parent: any;
    navigation: any;
    recognizer: any;
    childRecognizer: any;
    catchAllHandler: any;
    routes: any;
    fallbackOrder: any;
    isNavigating: any;
    constructor(container: any, history: any);
    isRoot: boolean;
    registerViewPort(viewPort: any, name: any): void;
    refreshBaseUrl(): void;
    refreshNavigation(): void;
    configure(callbackOrConfig: any): Router;
    navigate(fragment: any, options: any): any;
    navigateBack(): void;
    createChild(container: any): Router;
    createNavigationInstruction(url?: string, parentInstruction?: any): any;
    createNavigationContext(instruction: any): NavigationContext;
    generate(name: any, params: any): any;
    addRoute(config: any, navModel?: {
        title: any;
        settings: any;
        order: any;
        href: any;
        isActive: boolean;
        config: any;
        relativeHref: any;
    }): void;
    handleUnknownRoutes(config: any): void;
    reset(): void;
}
