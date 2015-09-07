# Aurelia-TypeScript

A starter kit for working with the Aurelia TypeScript type definitions

## What's New

### All samples updated to the Aurelia [Early September Release](http://blog.durandal.io/2015/09/05/aurelia-early-september-release-notes/)

The goal of the Aurelia-TypeScript project is to help you quickly get started using Aurelia and TypeScript and then to help you rapidly expand your expertise building systems with Aurelia and TypeScript.

As part of this effort, documentation for the samples, IDEs, and other notes can now be found in one consolidated location.

[Aurelia TypeScript Samples](http://www.cmichaelgraham.io/aurelia-typescript-samples/)

The Aurelia repositories now include type information as part of the `.js` source code.  This type information is extracted during the repo build process to automatically generate a `.d.ts` file (for each repo).

For example, [Aurelia Framework](https://github.com/aurelia/framework)'s `.d.ts` file can be found here: [aurelia-framework.d.ts](https://github.com/aurelia/framework/blob/master/dist/amd/aurelia-framework.d.ts).

All of the samples have been updated to the TypeScript 1.5 release.

In addition, the Visual Studio samples have been updated and verified using the release of Visual Studio 2015.

As always, feel free to look me up and thanks for your interest in Aurelia and TypeScript :)

[![Join the chat at https://gitter.im/cmichaelgraham/aurelia-typescript-atom](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/cmichaelgraham/aurelia-typescript?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Aurelia `.d.ts` files

Periodically, I round up the `.d.ts` files when I make new AMD bundles.  Those files can be found <a href="https://github.com/cmichaelgraham/aurelia-amd-bundler/tree/master/typings/aurelia" target="_blank">here</a>.  (Please go to the individual Aurelia repositories for the latest, up-to-date versions).

This library works with the [Aurelia](http://www.aurelia.io/) platform.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

## Table of Contents

1. [visual studio: typescript esri dojo amd](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it---visual-studio-using-esri-dojo-amd-module-loader)
2. [visual studio: mobile typescript esri dojo amd](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it-on-mobile-devices----visual-studio-and-telerik-appbuilder)
3. [visual studio: typescript requirejs amd](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it---visual-studio-using-requirejs-amd-module-loader)
4. [gulp: requirejs amd](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it---gulp)
5. [webstorm: requirejs amd](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it-webstorm)
6. [@PWKad Samples](https://github.com/cmichaelgraham/aurelia-typescript#just-use-it---pwkad-samples-with-visual-studio-using-requirejs-amd-module-loader)
7. [unit tests](https://github.com/cmichaelgraham/aurelia-typescript#explore-aurelia-by-looking-at-the-tests)
8. [bundling with r.js](https://github.com/cmichaelgraham/aurelia-typescript#bundling)
9. [@Lakerfield samples](https://github.com/cmichaelgraham/aurelia-typescript#cool-sample-exercising-navigation-from-lakerfield)
10. [code sandbox](https://github.com/cmichaelgraham/aurelia-typescript#code-sandbox---place-to-illustrate-various-code-usage)
11. [multi-level menu sample](https://github.com/cmichaelgraham/aurelia-typescript#multi-level-menu)
12. [todo sample](https://github.com/cmichaelgraham/aurelia-typescript#todo-sample)
13. [browser support by solution](https://github.com/cmichaelgraham/aurelia-typescript#browser-support-by-solution)
14. [howto push samples to gh pages](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/README.md#push-samples-to-gh-pages)
15. [links to related content](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/README.md#links-to-related-content)

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts) - visual studio (using esri dojo amd module loader)

   includes bonus aurelia view & view model with a basic esri map
   
1. [skel-nav-esri-vs-ts documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/skel-nav-esri-vs-ts.html)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `skel-nav-esri-vs-ts`
3. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts-telerik) (on mobile devices !!) - visual studio and telerik appbuilder

![aurelia mobile map](https://cloud.githubusercontent.com/assets/10272832/6097893/13ec4a94-af8b-11e4-84e0-3daf7ab9fdc7.png)

1. [skel-nav-esri-vs-ts-telerik documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/skel-nav-esri-vs-ts-telerik.html)
1. get familiar with [telerik appbuilder](http://www.telerik.com/appbuilder?gclid=CjwKEAiAxsymBRCegqiLzI7Q1S8SJADOgQrzc9xUVwF5CvDrJKjjjGyjeriPEDv8laO6TbxxascDaxoCnfHw_wcB)
2. obtain a license to telerik appbuilder (or do an evaluation)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
5. install telerik appbuilder
6. run visual studio
7. open [solution](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts-telerik) in `skel-nav-esri-vs-ts-telerik`
8. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-require-vs-ts) - visual studio (using requirejs amd module loader)

1. [skel-nav-require-vs-ts documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/skel-nav-require-vs-ts.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/skel-nav-require-vs-ts/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `skel-nav-require-vs-ts`
3. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-gulp) - gulp

1. [skel-nav-esri-gulp documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/skel-nav-esri-gulp.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/skel-nav-esri-gulp/)
1. run `git bash` shell
2. change to `skel-nav-esri-gulp` folder
3. run `npm install`
4. run `gulp watch`
5. run chrome browser and point at `http://localhost:9000`

## [just use it webstorm](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-require-webstorm-ts) 

[skel-nav-require-webstorm-ts documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/skel-nav-require-webstorm-ts.html).

the project is already setup with file watcher but you can follow the full instruction here to add TypeScript file watcher  [webstorm typescript file watcher](https://www.jetbrains.com/webstorm/help/typescript-support.html)
   
## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/pwkad-aurelia-samples) - @PWKad Samples with visual studio (using requirejs amd module loader)

1. [pwkad-aurelia-samples documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/pwkad-aurelia-samples.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/pwkad-aurelia-samples/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `pwkad-aurelia-samples`
3. run solution using chrome

@PWKad Samples Illustrate:

1. [Aurelia Attached Behavior - Markdown Editor](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/pwkad-aurelia-samples#markdown-editor--attached-behavior)
   
## explore aurelia by looking at [the tests](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-vs-ts-tests)

![tests 03](https://cloud.githubusercontent.com/assets/10272832/6097899/4042e1fc-af8b-11e4-8559-f93fa2bbea93.png)

1. [aurelia-vs-ts-tests documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/aurelia-vs-ts-tests.html)
1. have a look at the TypeScript test source [for aurelia-dependency-injection](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-vs-ts-tests/aurelia-vs-ts-tests/tests/dependency-injection-tests.ts)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `aurelia-vs-ts-tests`
3. run solution using chrome
   
## [bundling](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-require-bundle)

* [link to un-minimized bundle](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/aurelia-bundle.js) - 478K
* [link to minimized bundle](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/aurelia-bundle.min.js) - 213K


![nav 01](https://cloud.githubusercontent.com/assets/10272832/6092927/9595bd04-aeb0-11e4-9773-ea07da1e04af.png)

1. open `git bash shell`
2. install `node.js`
2. install `bower`
3. change to `aurelia-require-bundle` folder
3. get the latest aurelia libraries

   run `bower install`

4. have a look at the bundling dependencies

  * [manifest of dependencies](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/aurelia-bundle-manifest.js)
  * [main-config](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/main-config.js)
  * [bower config](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/bower.json)

5. bundle the files for development

   run `node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.js optimize=none`

6. bundle the files for production (minified)

   run `node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.min.js`

## [cool sample](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-vs-ts) exercising navigation (from @Lakerfield)

1. [aurelia-vs-ts documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/pwkad-aurelia-samples.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/aurelia-vs-ts/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `aurelia-vs-ts`
5. run solution in chrome browser

## [code sandbox](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox) - place to illustrate various code usage

1. [code-sandbox documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/code-sandbox.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/code-sandbox/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `code-sandbox`
3. run solution using chrome

> Code Sandbox has code that Illustrates:

1. [Child VM](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#creating-a-vm-that-has-a-property-that-is-an-object-like-a-child-vm)
2. [Adding Dynamic Routes](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#adding-a-route-dynamically)
3. [Wizard Routing Sample](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/code-sandbox#wizard-routing-sample)
4. [3d aurelia cube using threejs](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/code-sandbox/README.md#aurelia-cube-using-threejs)

## [multi-level menu](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/multi-level-menu)

![multi-level-menu working](https://cloud.githubusercontent.com/assets/10272832/6319803/fa044570-ba87-11e4-8912-2cb9286ee089.png)

1. [multi-level-menu documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/multi-level-menu.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/multi-level-menu/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `multi-level-menu`
3. run solution using chrome

## [todo sample](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/todo-require-vs-ts)

![todo working](https://cloud.githubusercontent.com/assets/10272832/6326180/3d84dd30-bb0c-11e4-9fd9-2784a5a78e85.png)

1. [todo-require-vs-ts documentation](http://www.cmichaelgraham.io/aurelia-typescript-samples/aurelia-typescript-samples/todo-require-vs-ts.html)
1. [view running project](http://cmichaelgraham.github.io/aurelia-typescript/todo-require-vs-ts/)
3. Make sure you have Visual Studio 2015: [Free Comunity Edition](https://www.visualstudio.com/downloads/download-visual-studio-vs) or higher
> TypeScript 1.5 is included in this install.
1. Run Visual Studio 2015
2. open solution in `todo-require-vs-ts`
3. run solution using chrome

## browser support by solution

work is underway to address browser support for the solutions in this repo.  this table will be updated as enhancements are made and support is validated.  [see also issue #7](https://github.com/cmichaelgraham/aurelia-typescript/issues/7)

| Solution | Chrome | Firefox | IE11 | IE10 | IE9 |
| --- | :---: | :---: | :---: | :---: | :---: |
| aurelia-vs-ts | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| code-sandbox | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| multi-level-menu | :white_check_mark: | :white_check_mark: | :memo: | :memo: | :memo: |
| pwkad-aurelia-samples | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| skel-nav-esri-gulp | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| skel-nav-esri-vs-ts | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| skel-nav-require-vs-ts | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |
| todo-require-vs-ts | :white_check_mark: | :memo: | :memo: | :memo: | :memo: |

| Solution | Telerik Simulator | Samsung Note 4 |
| --- | :---: | :---: |
| skel-nav-esri-vs-ts-telerik | :memo: | :memo: |

## [push samples to gh-pages](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/push-samples-to-gh-pages)

code used to copy the samples to [cmichaelgraham gh-pages](http://cmichaelgraham.github.io).  includes the recipe for following the same pattern in your own world.

## Links to Related Content

1. [Colin Dembovsky - Debugging Within Visual Studio](http://colinsalmcorner.com/post/aurelia--debugging-from-within-visual-studio)
2. [Behzad Abbasi (Behzad88) - HotWater-Aurelia](https://www.nuget.org/packages/HotWater-Aurelia/)
3. Erik's cool [aurelia getting started cheat sheet](http://www.cheatography.com/erikch/cheat-sheets/aurelia-getting-started/pdf/)
4. Erik's associated [aurelia getting started blog](http://www.programwitherik.com/what-you-should-know-about-aurelia-javascript-client-framework/)

## Contributing

We'd love for you to contribute to our source code and to make this project even better than it is today! If this interests you, please begin by reading [our contributing guidelines](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md). The contributing document will provide you with all the information you need to get started. Once you have read that, you will need to also [sign our CLA](http://goo.gl/forms/dI8QDDSyKR) before we can accepts a Pull Request from you. More information on the process is including in the [contributor's guide](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md).
