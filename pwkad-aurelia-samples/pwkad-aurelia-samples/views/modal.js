define(["require", "exports", "aurelia-framework"], function (require, exports, auf) {
    var Modal = (function () {
        function Modal() {
            this.modal = new ModalObject(false);
        }
        Modal.metadata = function () {
            return auf.Behavior.customElement('modal').withProperty('showing', 'valueChanged', 'modal');
        };
        Modal.prototype.toggleShowing = function () {
            console.log(this.showing);
            this.showing = !this.showing;
        };
        Modal.prototype.activate = function (value) {
            console.log(value);
            this.toggle = value.toggle;
            this.showing = value.showing;
        };
        Modal.prototype.showingChanged = function (hey) {
            console.log('hey you - ', hey);
        };
        Modal.prototype.valueChanged = function (hey) {
            console.log('hey you !! - ', hey);
        };
        return Modal;
    })();
    exports.Modal = Modal;
    var ModalObject = (function () {
        function ModalObject(showing) {
            this.showing = showing;
        }
        return ModalObject;
    })();
});
//# sourceMappingURL=modal.js.map