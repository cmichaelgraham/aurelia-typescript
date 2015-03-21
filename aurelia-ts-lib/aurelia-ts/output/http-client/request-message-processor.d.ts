export declare class RequestMessageProcessor {
    XHRType: any;
    transformers: any;
    xhr: any;
    constructor(xhrType: any, transformers: any);
    abort(): void;
    process(client: any, message: any): Promise<{}>;
}
