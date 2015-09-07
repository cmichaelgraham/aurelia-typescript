define(["exports", "./property-observation"], function (exports, _propertyObservation) {
  "use strict";

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function createObserverLookup(obj) {
    var value = new _propertyObservation.BreezeObjectObserver(obj);

    Object.defineProperty(obj, "__breezeObserver__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  function createCanObserveLookup(entityType) {
    var value = {},
        properties = entityType.getProperties(),
        property,
        ii = properties.length,
        i;

    for (i = 0; i < ii; i++) {
      property = properties[i];

      value[property.name] = property.isDataProperty || property.isScalar;
    }

    Object.defineProperty(entityType, "__canObserve__", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: value
    });

    return value;
  }

  var BreezeObservationAdapter = (function () {
    function BreezeObservationAdapter() {
      _classCallCheck(this, BreezeObservationAdapter);
    }

    BreezeObservationAdapter.prototype.handlesProperty = function handlesProperty(object, propertyName) {
      var type = object.entityType;
      return type ? !!(type.__canObserve__ || createCanObserveLookup(type))[propertyName] : false;
    };

    BreezeObservationAdapter.prototype.getObserver = function getObserver(object, propertyName) {
      var observerLookup;

      if (!this.handlesProperty(object, propertyName)) throw new Error("BreezeBindingAdapter does not support observing the " + propertyName + " property.  Check the handlesProperty method before calling createObserver.");

      observerLookup = object.__breezeObserver__ || createObserverLookup(object);
      return observerLookup.getObserver(propertyName);
    };

    return BreezeObservationAdapter;
  })();

  exports.BreezeObservationAdapter = BreezeObservationAdapter;
});