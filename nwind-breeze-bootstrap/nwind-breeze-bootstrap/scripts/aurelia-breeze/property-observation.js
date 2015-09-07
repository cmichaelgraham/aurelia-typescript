define(['exports'], function (exports) {
  'use strict';

  exports.__esModule = true;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var BreezePropertyObserver = (function () {
    function BreezePropertyObserver(obj, propertyName, subscribe) {
      _classCallCheck(this, BreezePropertyObserver);

      this.obj = obj;
      this.propertyName = propertyName;
      this.subscribe = subscribe;
    }

    BreezePropertyObserver.prototype.getValue = function getValue() {
      return this.obj[this.propertyName];
    };

    BreezePropertyObserver.prototype.setValue = function setValue(newValue) {
      this.obj[this.propertyName] = newValue;
    };

    return BreezePropertyObserver;
  })();

  exports.BreezePropertyObserver = BreezePropertyObserver;

  var BreezeObjectObserver = (function () {
    function BreezeObjectObserver(obj) {
      _classCallCheck(this, BreezeObjectObserver);

      this.obj = obj;
      this.observers = {};
      this.callbacks = {};
      this.callbackCount = 0;
    }

    BreezeObjectObserver.prototype.subscribe = function subscribe(propertyName, callback) {
      if (this.callbacks[propertyName]) {
        this.callbacks[propertyName].push(callback);
      } else {
        this.callbacks[propertyName] = [callback];
        this.callbacks[propertyName].oldValue = this.obj[propertyName];
      }

      if (this.callbackCount === 0) {
        this.subscription = this.obj.entityAspect.propertyChanged.subscribe(this.handleChanges.bind(this));
      }

      this.callbackCount++;

      return this.unsubscribe.bind(this, propertyName, callback);
    };

    BreezeObjectObserver.prototype.unsubscribe = function unsubscribe(propertyName, callback) {
      var callbacks = this.callbacks[propertyName],
          index = callbacks.indexOf(callback);
      if (index === -1) {
        return;
      }

      callbacks.splice(index, 1);
      if (callbacks.count = 0) {
        callbacks.oldValue = null;
        this.callbacks[propertyName] = null;
      }

      this.callbackCount--;
      if (this.callbackCount === 0) {
        this.obj.entityAspect.propertyChanged.unsubscribe(this.subscription);
      }
    };

    BreezeObjectObserver.prototype.getObserver = function getObserver(propertyName) {
      return this.observers[propertyName] || (this.observers[propertyName] = new BreezePropertyObserver(this.obj, propertyName, this.subscribe.bind(this, propertyName)));
    };

    BreezeObjectObserver.prototype.handleChanges = function handleChanges(change) {
      var callbacks, i, ii, newValue, oldValue, key;

      if (change.propertyName === null) {
        callbacks = this.callbacks;
        for (key in callbacks) {
          if (callbacks.hasOwnProperty(key)) {
            this.handleChanges({ propertyName: key });
          }
        }
      } else {
        callbacks = this.callbacks[change.propertyName];
      }

      if (!callbacks) {
        return;
      }

      newValue = this.obj[change.propertyName];
      oldValue = 'oldValue' in change ? change.oldValue : callbacks.oldValue;

      if (newValue === oldValue) {
        return;
      }

      for (i = 0, ii = callbacks.length; i < ii; i++) {
        callbacks[i](newValue, oldValue);
      }

      callbacks.oldValue = newValue;
    };

    return BreezeObjectObserver;
  })();

  exports.BreezeObjectObserver = BreezeObjectObserver;
});