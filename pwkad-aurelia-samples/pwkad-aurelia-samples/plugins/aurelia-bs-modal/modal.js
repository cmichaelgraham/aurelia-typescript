if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    var Modal = (function () {
        function Modal(element) {
            this.showing = false;
            this.element = element;
        }
        Modal.prototype.attached = function () {
            $(this.modal).modal({ show: false });
        };
        Modal.prototype.showingChanged = function (newValue) {
            if (newValue) {
                $(this.modal).modal('show');
            }
            else {
                $(this.modal).modal('hide');
            }
        };
        __decorate([
            aurelia_framework_1.bindable
        ], Modal.prototype, "showing");
        Modal = __decorate([
            aurelia_framework_1.customElement('modal'),
            aurelia_framework_1.inject(Element)
        ], Modal);
        return Modal;
    })();
    exports.Modal = Modal;
});
//# sourceMappingURL=modal.js.map