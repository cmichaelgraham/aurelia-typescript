if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    var ModalHeader = (function () {
        function ModalHeader() {
            this.title = '';
            this.close = closeModal;
        }
        __decorate([
            aurelia_framework_1.bindable
        ], ModalHeader.prototype, "title");
        __decorate([
            aurelia_framework_1.bindable
        ], ModalHeader.prototype, "close");
        return ModalHeader;
    })();
    exports.ModalHeader = ModalHeader;
    function closeModal() {
        console.log('Please bind a function to close modal - "<modal-header close.call="myFunc()"></modal-header>');
    }
});
//# sourceMappingURL=modal-header.js.map