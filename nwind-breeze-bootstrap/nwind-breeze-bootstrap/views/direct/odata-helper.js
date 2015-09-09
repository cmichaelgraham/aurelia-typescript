var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", 'aurelia-framework', 'aurelia-fetch-client', 'fetch'], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    var OdataHelper = (function () {
        function OdataHelper(http) {
            var _this = this;
            this.inlineCountProp = false;
            this.execQuery = function () {
                var that = _this;
                return new Promise(function (resolve, reject) {
                    // error if no url
                    if (!that.urlProp) {
                        reject('Error in OdataHelper: missing required url');
                    }
                    // error if no from clause
                    if (!that.fromProp) {
                        reject('Error in OdataHelper: missing required from');
                    }
                    // build query
                    var query = "/" + that.fromProp + "?$format=json";
                    // add filter if present
                    if (that.filterProp) {
                        query += "&$filter=" + that.filterProp;
                    }
                    // add select if present
                    if (that.selectProp) {
                        query += "&$select=" + that.selectProp;
                    }
                    // add orderBy if present
                    if (that.orderByProp) {
                        query += "&$orderby=" + that.orderByProp + (that.descProp ? ' desc' : '');
                    }
                    // add skip if present
                    if (that.skipProp) {
                        query += "&$skip=" + that.skipProp;
                    }
                    // add take if present
                    if (that.takeProp) {
                        query += "&$top=" + that.takeProp;
                    }
                    // add inlineCount if present
                    if (that.inlineCountProp) {
                        query += "&$inlinecount=allpages";
                    }
                    // add expand if present
                    if (that.expandProp) {
                        query += "&$expand=" + that.expandProp;
                    }
                    // execute query
                    that.http.configure(function (config) {
                        config
                            .useStandardConfiguration()
                            .withBaseUrl(that.urlProp);
                    });
                    return that.http.fetch(query)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (items) {
                        resolve(items);
                        return Promise.resolve(items);
                    });
                });
            };
            this.url = function (url) {
                _this.urlProp = url;
                return _this;
            };
            this.fromm = function (fromm) {
                _this.fromProp = fromm;
                return _this;
            };
            this.filter = function (filter) {
                _this.filterProp = filter;
                return _this;
            };
            this.select = function (select) {
                _this.selectProp = select;
                return _this;
            };
            this.orderBy = function (orderBy, desc) {
                _this.orderByProp = orderBy;
                _this.descProp = desc;
                return _this;
            };
            this.skip = function (count) {
                _this.skipProp = count;
                return _this;
            };
            this.take = function (count) {
                _this.takeProp = count;
                return _this;
            };
            this.inlineCount = function () {
                _this.inlineCountProp = true;
                return _this;
            };
            this.expand = function (expand) {
                _this.expandProp = expand;
                return _this;
            };
            this.http = http;
        }
        OdataHelper = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient), 
            __metadata('design:paramtypes', [aurelia_fetch_client_1.HttpClient])
        ], OdataHelper);
        return OdataHelper;
    })();
    exports.OdataHelper = OdataHelper;
});
//# sourceMappingURL=odata-helper.js.map