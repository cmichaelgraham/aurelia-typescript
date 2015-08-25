declare module 'aurelia-history/index' {
	export class History {
	    activate(options: {}): boolean;
	    deactivate(): void;
	    navigate(fragment: string, options: {}): boolean;
	    navigateBack(): void;
	}

}
declare module 'aurelia-history' {
	export * from 'aurelia-history/index';
}
