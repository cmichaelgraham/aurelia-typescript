import { RequestMessageProcessor } from './request-message-processor';
export declare class JSONPRequestMessage {
    constructor(uri: any, callbackParameterName: any);
}
export declare function createJSONPRequestMessageProcessor(): RequestMessageProcessor;
