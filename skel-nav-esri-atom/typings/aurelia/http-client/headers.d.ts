export declare class Headers {
    headers: any;
    constructor(headers?: {});
    add(key: any, value: any): void;
    get(key: any): any;
    clear(): void;
    configureXHR(xhr: any): void;
    /**
     * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
     * headers according to the format described here:
     * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
     * This method parses that string into a user-friendly key/value pair object.
     */
    static parse(headerStr: any): Headers;
}
