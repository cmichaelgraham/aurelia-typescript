define(["exports"], function (exports) {
  "use strict";

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Q = (function () {
    function Q() {
      _classCallCheck(this, Q);
    }

    Q.defer = function defer() {
      return new Deferred();
    };

    Q.resolve = function resolve(data) {
      return Promise.resolve(data);
    };

    Q.reject = function reject(reason) {
      return Promise.reject(reason);
    };

    return Q;
  })();

  exports.Q = Q;

  var Deferred = function Deferred() {
    _classCallCheck(this, Deferred);

    var self = this;
    this.promise = new Promise(function (resolve, reject) {
      self.resolve = resolve;
      self.reject = reject;
    });
  };

  exports.Deferred = Deferred;
});