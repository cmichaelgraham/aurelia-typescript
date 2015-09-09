import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

@inject(HttpClient)
export class OdataHelper {
    http: HttpClient;
    urlProp: string;
    fromProp: string;
    filterProp: string;
    selectProp: string;
    orderByProp: string;
    descProp: boolean;
    skipProp: number;
    takeProp: number;
    inlineCountProp: boolean = false;
    expandProp: string;

    constructor(http: HttpClient) {
        this.http = http;
    }

    execQuery = (): Promise<Array<any>> => {
        return new Promise<Array<any>>((resolve, reject) => {
            // error if no url
            if (!this.urlProp) {
                reject('Error in OdataHelper: missing required url');
            }

            // error if no from clause
            if (!this.fromProp) {
                reject('Error in OdataHelper: missing required from');
            }

            // build query
            let prefix = '?';
            let query = `${this.fromProp}`

            // add filter if present
            if (this.filterProp) {
                query += `${prefix}$filter=${this.filterProp}`;
                prefix = '&';
            }

            // add select if present
            if (this.selectProp) {
                query += `${prefix}$select=${this.selectProp}`;
                prefix = '&';
            }

            // add orderBy if present
            if (this.orderByProp) {
                query += `${prefix}$orderby=${this.filterProp}${this.descProp ? ' desc' : ''}`;
                prefix = '&';
            }

            // add skip if present
            if (this.skipProp) {
                query += `${prefix}$skip=${this.skipProp}`;
                prefix = '&';
            }

            // add take if present
            if (this.takeProp) {
                query += `${prefix}$top=${this.takeProp}`;
                prefix = '&';
            }

            // add inlineCount if present
            if (this.filterProp) {
                query += `${prefix}$inlinecount=allpages`;
                prefix = '&';
            }

            // add expand if present
            if (this.expandProp) {
                query += `${prefix}$expand=${this.expandProp}`;
                prefix = '&';
            }

            // execute query
            this.http.configure(config => {
                config
                    .useStandardConfiguration()
                    .withBaseUrl(this.urlProp);

                this.http.fetch(query)
                    .then(response => response.json())
                    .then(items => resolve(items));
            });


        });
    }

    url = (url: string): OdataHelper => {
        this.urlProp = url;
        return this;
    }

    fromm = (fromm: string): OdataHelper => {
        this.fromProp = fromm;
        return this;
    }

    filter = (filter: string): OdataHelper => {
        this.filterProp = filter;
        return this;
    }

    select = (select: string): OdataHelper => {
        this.selectProp = select;
        return this;
    }

    orderBy = (orderBy: string, desc?:boolean): OdataHelper => {
        this.orderByProp = orderBy;
        this.descProp = desc;
        return this;
    }

    skip = (count: number): OdataHelper => {
        this.skipProp = count;
        return this;
    }

    take = (count: number): OdataHelper => {
        this.takeProp = count;
        return this;
    }

    inlineCount = (): OdataHelper => {
        this.inlineCountProp = true;
        return this;
    }

    expand = (expand: string): OdataHelper => {
        this.expandProp = expand;
        return this;
    }
}