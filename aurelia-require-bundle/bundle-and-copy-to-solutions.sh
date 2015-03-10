node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.js optimize=none

node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.min.js

cp -f aurelia-bundle.js aurelia-bundle.min.js ../aurelia-vs-ts/aurelia-vs-ts/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../aurelia-vs-ts-tests/aurelia-vs-ts-tests/scripts
cp -f aurelia-bundle.js aurelia-bundle.min.js ../code-sandbox/code-sandbox/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../multi-level-menu/multi-level-menu/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../pwkad-aurelia-samples/pwkad-aurelia-samples/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-gulp/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-vs-ts/skel-nav-esri-vs-ts/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-vs-ts-telerik/skel-nav-esri-vs-ts-telerik/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-require-vs-ts/skel-nav-require-vs-ts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-require-webstorm-ts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../todo-require-vs-ts/todo-require-vs-ts/aurelia