require.config({
  baseUrl : '',

  paths: {
    'aurelia-bootstrapper': 'aurelia-latest/bootstrapper/dist/amd/index',
    'aurelia-loader-default': 'aurelia-latest/loader-default/dist/amd/index',
    'aurelia-path': 'aurelia-latest/path/dist/amd/index',
    'aurelia-task-queue': 'aurelia-latest/task-queue/dist/amd/index',
    'aurelia-logging': 'aurelia-latest/logging/dist/amd/index',
    'aurelia-logging-console': 'aurelia-latest/logging-console/dist/amd/index',
    'aurelia-history': 'aurelia-latest/history/dist/amd/index',
    'aurelia-history-browser': 'aurelia-latest/history-browser/dist/amd/index',
    'aurelia-event-aggregator': 'aurelia-latest/event-aggregator/dist/amd/index',
    'aurelia-html-template-element': 'aurelia-latest/html-template-element/dist/HTMLTemplateElement'
  },

  packages : [
    {
      name: 'aurelia-loader',
      location: 'aurelia-latest/loader/dist/amd',
      main : 'index'
    },
   {
     name: 'aurelia-framework',
     location: 'aurelia-latest/framework/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-metadata',
     location: 'aurelia-latest/metadata/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-binding',
     location: 'aurelia-latest/binding/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating',
     location: 'aurelia-latest/templating/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-dependency-injection',
     location: 'aurelia-latest/dependency-injection/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-router',
     location: 'aurelia-latest/router/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-binding',
     location: 'aurelia-latest/templating-binding/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-resources',
     location: 'aurelia-latest/templating-resources/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-templating-router',
     location: 'aurelia-latest/templating-router/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-route-recognizer',
     location: 'aurelia-latest/route-recognizer/dist/amd',
     main : 'index'
   },
   {
     name: 'aurelia-http-client',
     location: 'aurelia-latest/http-client/dist/amd',
     main : 'index'
   },
   { name: "core-js", location: "bower_components/core-js/dist", main: "core.src" }  ]
});
