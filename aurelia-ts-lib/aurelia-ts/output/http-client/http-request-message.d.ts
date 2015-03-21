import { RequestMessageProcessor } from './request-message-processor';
export declare class HttpRequestMessage {
    method: any;
    uri: any;
    content: any;
    headers: any;
    responseType: any;
    constructor(method: any, uri: any, content?: any, headers?: any);
}
export declare function createHttpRequestMessageProcessor(): RequestMessageProcessor;
