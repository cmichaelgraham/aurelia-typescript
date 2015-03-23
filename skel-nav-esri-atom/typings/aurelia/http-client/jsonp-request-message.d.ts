import { RequestMessageProcessor } from './request-message-processor';
export declare class JSONPRequestMessage {
    method: any;
    uri: any;
    content: any;
    headers: any;
    responseType: any;
    callbackParameterName: any;
    constructor(uri: any, callbackParameterName: any);
}
export declare function createJSONPRequestMessageProcessor(): RequestMessageProcessor;
