require.config({
  baseUrl : '',

  packages : [
   {
     name: 'aurelia-bootstrapper',
     location: 'bower_components/aurelia-bootstrapper/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-loader-default',
     location: 'bower_components/aurelia-loader-default/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-loader',
     location: 'bower_components/aurelia-loader/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-path',
     location: 'bower_components/aurelia-path/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-task-queue',
     location: 'bower_components/aurelia-task-queue/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-logging',
     location: 'bower_components/aurelia-logging/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-logging-console',
     location: 'bower_components/aurelia-logging-console/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-history',
     location: 'bower_components/aurelia-history/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-history-browser',
     location: 'bower_components/aurelia-history-browser/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-event-aggregator',
     location: 'bower_components/aurelia-event-aggregator/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-framework',
     location: 'bower_components/aurelia-framework/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-metadata',
     location: 'bower_components/aurelia-metadata/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-binding',
     location: 'bower_components/aurelia-binding/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating',
     location: 'bower_components/aurelia-templating/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-dependency-injection',
     location: 'bower_components/aurelia-dependency-injection/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-router',
     location: 'bower_components/aurelia-router/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-binding',
     location: 'bower_components/aurelia-templating-binding/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-resources',
     location: 'bower_components/aurelia-templating-resources/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-router',
     location: 'bower_components/aurelia-templating-router/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-route-recognizer',
     location: 'bower_components/aurelia-route-recognizer/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-http-client',
     location: 'bower_components/aurelia-http-client/dist/amd',
     main : 'index'
   }]

});

require([
  'aurelia-bootstrapper',
  'aurelia-loader',
  'aurelia-loader-default',
  'aurelia-path',
  'aurelia-task-queue',
  'aurelia-logging',
  'aurelia-logging-console',
  'aurelia-history',
  'aurelia-history-browser',
  'aurelia-event-aggregator',
  'aurelia-framework',
  'aurelia-metadata',
  'aurelia-binding',
  'aurelia-templating',
  'aurelia-dependency-injection',
  'aurelia-router',
  'aurelia-templating-binding',
  'aurelia-templating-resources',
  'aurelia-templating-router',
  'aurelia-route-recognizer',
  'aurelia-http-client'
  ]);