define(["require", "exports", 'aurelia-dependency-injection'], function (require, exports, aurelia_dependency_injection_1) {
    exports.run = function () {
        describe('Parent', function () {
            it('should return the key from the parent container when present', function () {
                var sut = new aurelia_dependency_injection_1.Parent("test"), parent = new aurelia_dependency_injection_1.Container(), childContainer = parent.createChild(), instance = {}, wrongInstance = {};
                parent.registerInstance("test", instance);
                childContainer.registerInstance("test", wrongInstance);
                var result = sut.get(childContainer);
                expect(result).toBe(instance);
                expect(result).not.toBe(wrongInstance);
            });
            it('should return null when the parent container is not present', function () {
                var sut = new aurelia_dependency_injection_1.Parent("test"), childContainer = new aurelia_dependency_injection_1.Container(), instance = {};
                childContainer.registerInstance("test", instance);
                expect(sut.get(childContainer)).toBe(null);
            });
        });
    };
});
//# sourceMappingURL=metadata.spec.js.map