define(["require", "exports"], function (require, exports) {
    var OdataHelper = (function () {
        function OdataHelper() {
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
                    var query = _this.urlProp + "/" + _this.fromProp;
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
                });
            };
            this.url = function (url) {
                _this.urlProp = url;
                return _this;
            };
            this.from = function (from) {
                _this.fromProp = from;
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
        }
        return OdataHelper;
    })();
    exports.OdataHelper = OdataHelper;
});
//# sourceMappingURL=odata-helper.js.map