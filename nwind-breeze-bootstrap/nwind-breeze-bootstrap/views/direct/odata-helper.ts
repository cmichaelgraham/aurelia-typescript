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
        var that = this;

        return new Promise<Array<any>>((resolve, reject) => {
            // error if no url
            if (!that.urlProp) {
                reject('Error in OdataHelper: missing required url');
            }

            // error if no from clause
            if (!that.fromProp) {
                reject('Error in OdataHelper: missing required from');
            }

            // build query
            let query = `/${that.fromProp}?$format=json`

            // add filter if present
            if (that.filterProp) {
                query += `&$filter=${that.filterProp}`;
            }

            // add select if present
            if (that.selectProp) {
                query += `&$select=${that.selectProp}`;
            }

            // add orderBy if present
            if (that.orderByProp) {
                query += `&$orderby=${that.orderByProp}${that.descProp ? ' desc' : ''}`;
            }

            // add skip if present
            if (that.skipProp) {
                query += `&$skip=${that.skipProp}`;
            }

            // add take if present
            if (that.takeProp) {
                query += `&$top=${that.takeProp}`;
            }

            // add inlineCount if present
            if (that.inlineCountProp) {
                query += `&$inlinecount=allpages`;
            }

            // add expand if present
            if (that.expandProp) {
                query += `&$expand=${that.expandProp}`;
            }

            // execute query
            that.http.configure(config => {
                config
                    .useStandardConfiguration()
                    .withBaseUrl(that.urlProp);
            });

            return that.http.fetch(query)
                .then(response => {
                    return response.json();
                })
                .then(items => {
                    resolve(items);
                    return Promise.resolve(items);
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

    orderBy = (orderBy: string, desc?: boolean): OdataHelper => {
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