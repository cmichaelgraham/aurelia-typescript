node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.js optimize=none

node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.min.js

cp -f aurelia-bundle.js aurelia-bundle.min.js ../aurelia-vs-ts/aurelia-vs-ts/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../aurelia-vs-ts-tests/aurelia-vs-ts-tests/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../code-sandbox/code-sandbox/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../multi-level-menu/multi-level-menu/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../pwkad-aurelia-samples/pwkad-aurelia-samples/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-gulp/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-vs-ts/skel-nav-esri-vs-ts/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-require-vs-ts/skel-nav-require-vs-ts/scripts/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../todo-require-vs-ts/todo-require-vs-ts/aurelia

cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-esri-vs-ts-telerik/skel-nav-esri-vs-ts-telerik/aurelia
cp -f aurelia-bundle.js aurelia-bundle.min.js ../skel-nav-require-webstorm-ts/aurelia