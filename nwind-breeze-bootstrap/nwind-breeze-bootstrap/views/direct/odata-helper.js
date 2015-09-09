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
                return new Promise(function (resolve, reject) {
                    // error if no url
                    if (!_this.urlProp) {
                        reject('Error in OdataHelper: missing required url');
                    }
                    // error if no from clause
                    if (!_this.fromProp) {
                        reject('Error in OdataHelper: missing required from');
                    }
                    // build query
                    var prefix = '?';
                    var query = "" + _this.fromProp;
                    // add filter if present
                    if (_this.filterProp) {
                        query += prefix + "$filter=" + _this.filterProp;
                        prefix = '&';
                    }
                    // add select if present
                    if (_this.selectProp) {
                        query += prefix + "$select=" + _this.selectProp;
                        prefix = '&';
                    }
                    // add orderBy if present
                    if (_this.orderByProp) {
                        query += prefix + "$orderby=" + _this.filterProp + (_this.descProp ? ' desc' : '');
                        prefix = '&';
                    }
                    // add skip if present
                    if (_this.skipProp) {
                        query += prefix + "$skip=" + _this.skipProp;
                        prefix = '&';
                    }
                    // add take if present
                    if (_this.takeProp) {
                        query += prefix + "$top=" + _this.takeProp;
                        prefix = '&';
                    }
                    // add inlineCount if present
                    if (_this.filterProp) {
                        query += prefix + "$inlinecount=allpages";
                        prefix = '&';
                    }
                    // add expand if present
                    if (_this.expandProp) {
                        query += prefix + "$expand=" + _this.expandProp;
                        prefix = '&';
                    }
                    // execute query
                    _this.http.configure(function (config) {
                        config
                            .useStandardConfiguration()
                            .withBaseUrl(_this.urlProp);
                        _this.http.fetch(query)
                            .then(function (response) {
                            return response.json();
                        })
                            .then(function (items) {
                            return resolve(items);
                        });
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