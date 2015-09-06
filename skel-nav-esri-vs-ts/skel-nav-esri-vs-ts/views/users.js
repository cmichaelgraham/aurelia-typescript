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
    var Users = (function () {
        function Users(http) {
            this.heading = 'Github Users';
            this.users = [];
            http.configure(function (config) {
                config
                    .useStandardConfiguration()
                    .withBaseUrl('https://api.github.com/');
            });
            this.http = http;
        }
        Users.prototype.activate = function () {
            var _this = this;
            return this.http.fetch('users')
                .then(function (response) { return response.json(); })
                .then(function (users) { return _this.users = users; });
        };
        Users = __decorate([
            aurelia_framework_1.inject(aurelia_fetch_client_1.HttpClient), 
            __metadata('design:paramtypes', [Object])
        ], Users);
        return Users;
    })();
    exports.Users = Users;
});
//# sourceMappingURL=users.js.map