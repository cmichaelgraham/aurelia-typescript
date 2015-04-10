require.config({
  baseUrl : '',

  paths: {
    'aurelia-bootstrapper': 'bower_components/aurelia-bootstrapper/dist/amd/index',
    'aurelia-loader-default': 'bower_components/aurelia-loader-default/dist/amd/index',
    'aurelia-path': 'bower_components/aurelia-path/dist/amd/index',
    'aurelia-task-queue': 'bower_components/aurelia-task-queue/dist/amd/index',
    'aurelia-logging': 'bower_components/aurelia-logging/dist/amd/index',
    'aurelia-logging-console': 'bower_components/aurelia-logging-console/dist/amd/index',
    'aurelia-history': 'bower_components/aurelia-history/dist/amd/index',
    'aurelia-history-browser': 'bower_components/aurelia-history-browser/dist/amd/index',
    'aurelia-event-aggregator': 'bower_components/aurelia-event-aggregator/dist/amd/index',
    'aurelia-html-template-element': 'bower_components/aurelia-html-template-element/dist/HTMLTemplateElement'
  },

  packages : [
    {
      name: 'aurelia-loader',
      location: 'bower_components/aurelia-loader/dist/amd',
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
   },
   { name: "core-js", location: "bower_components/core-js/dist", main: "core.src" }  ]
});
