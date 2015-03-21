export declare class RequestMessageProcessor {
    constructor(xhrType: any, transformers: any);
    abort(): void;
    process(client: any, message: any): Promise<{}>;
}
