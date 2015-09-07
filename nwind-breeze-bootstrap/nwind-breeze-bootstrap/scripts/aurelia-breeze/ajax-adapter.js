define(['exports', 'breeze'], function (exports, _breeze) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _breeze2 = _interopRequireDefault(_breeze);

  var extend = _breeze2['default'].core.extend;

  var HttpResponse = (function () {
    function HttpResponse(aureliaResponse, config) {
      _classCallCheck(this, HttpResponse);

      this.config = config;
      this.status = aureliaResponse.statusCode;
      this.data = aureliaResponse.content;
      this.headers = aureliaResponse.headers;
    }

    HttpResponse.prototype.getHeader = function getHeader(headerName) {
      if (headerName === null || headerName === undefined || headerName === '') return this.headers.headers;
      return this.headers.get(headerName);
    };

    return HttpResponse;
  })();

  var AjaxAdapter = (function () {
    function AjaxAdapter() {
      _classCallCheck(this, AjaxAdapter);

      this.name = 'aurelia';
      this.defaultHeaders;
      this.requestInterceptor = null;
    }

    AjaxAdapter.prototype.setHttpClientFactory = function setHttpClientFactory(createHttpClient) {
      this.createHttpClient = createHttpClient;
    };

    AjaxAdapter.prototype.initialize = function initialize() {};

    AjaxAdapter.prototype.ajax = function ajax(config) {
      var requestInfo, header, method, request;

      requestInfo = {
        adapter: this,
        config: extend({}, config),
        zConfig: config,
        success: config.success,
        error: config.error
      };
      requestInfo.config.request = this.httpClient.createRequest();
      requestInfo.config.headers = extend(extend({}, this.defaultHeaders), config.headers);

      if (_breeze2['default'].core.isFunction(this.requestInterceptor)) {
        this.requestInterceptor(requestInfo);
        if (this.requestInterceptor.oneTime) {
          this.requestInterceptor = null;
        }
        if (!requestInfo.config) return;
      }
      config = requestInfo.config;

      request = config.request;

      request.withUrl(config.url);

      method = config.dataType && config.dataType.toLowerCase() === 'jsonp' ? 'jsonp' : config.type.toLowerCase();
      method = 'as' + method.charAt(0).toUpperCase() + method.slice(1);
      request[method]();

      request.withParams(config.params);

      if (config.contentType) {
        request.withHeader('Content-Type', config.contentType);
      }
      for (header in config.headers) {
        if (config.headers.hasOwnProperty(header)) {
          request.withHeader(header, config.headers[header]);
        }
      }

      if (config.hasOwnProperty('data')) {
        request.withContent(config.data);
      }

      request.send().then(function (r) {
        return requestInfo.success(new HttpResponse(r, requestInfo.zConfig));
      }, function (r) {
        return requestInfo.error(new HttpResponse(r, requestInfo.zConfig));
      });
    };

    _createClass(AjaxAdapter, [{
      key: 'httpClient',
      get: function get() {
        return this.client || (this.client = this.createHttpClient());
      }
    }]);

    return AjaxAdapter;
  })();

  _breeze2['default'].config.registerAdapter('ajax', AjaxAdapter);
});