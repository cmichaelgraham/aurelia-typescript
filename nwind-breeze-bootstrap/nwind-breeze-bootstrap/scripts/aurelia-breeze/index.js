define(['exports', 'breeze', './promise-adapter', 'aurelia-binding', './observation-adapter', 'aurelia-http-client', './ajax-adapter'], function (exports, _breeze, _promiseAdapter, _aureliaBinding, _observationAdapter, _aureliaHttpClient, _ajaxAdapter) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _breeze2 = _interopRequireDefault(_breeze);

  function configure(frameworkConfig) {
    _breeze2['default'].config.initializeAdapterInstance('modelLibrary', 'backingStore');

    _breeze2['default'].config.setQ(_promiseAdapter.Q);

    frameworkConfig.container.registerInstance(_aureliaBinding.ObjectObservationAdapter, new _observationAdapter.BreezeObservationAdapter());

    var adapter = _breeze2['default'].config.initializeAdapterInstance('ajax', 'aurelia', true);
    adapter.setHttpClientFactory(function () {
      return frameworkConfig.container.get(_aureliaHttpClient.HttpClient);
    });
  }
});