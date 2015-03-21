import { NavigationContext } from './navigation-context';
export declare class Router {
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
    addRoute(config: any, navModel?: {}): void;
    handleUnknownRoutes(config: any): void;
    reset(): void;
}
