# aurelia-typescript
A starter kit for working with the Aurelia TypeScript type definitions

## [aurelia.d.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/skel-nav-esri-vs-ts/skel-nav-esri-vs-ts/typings/aurelia/aurelia.d.ts)

This library works with the [Aurelia](http://www.aurelia.io/) platform.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts) - visual studio (using esri dojo amd module loader)

   includes bonus aurelia view & view model with a basic esri map
   
3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
1. run visual studio
2. open solution in `skel-nav-esri-vs-ts`
3. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts-telerik) (on mobile devices !!) - visual studio and telerik appbuilder

![aurelia mobile map](https://cloud.githubusercontent.com/assets/10272832/6097893/13ec4a94-af8b-11e4-84e0-3daf7ab9fdc7.png)

1. get familiar with [telerik appbuilder](http://www.telerik.com/appbuilder?gclid=CjwKEAiAxsymBRCegqiLzI7Q1S8SJADOgQrzc9xUVwF5CvDrJKjjjGyjeriPEDv8laO6TbxxascDaxoCnfHw_wcB)
2. obtain a license to telerik appbuilder (or do an evaluation)
3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
5. install telerik appbuilder
6. run visual studio
7. open [solution](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-vs-ts-telerik) in `skel-nav-esri-vs-ts-telerik`
8. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-require-vs-ts) - visual studio (using requirejs amd module loader)

3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
1. run visual studio
2. open solution in `skel-nav-require-vs-ts`
3. run solution using chrome

## [just use it](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-gulp) - gulp

1. run `git bash` shell
2. change to `skel-nav-esri-gulp` folder
3. run `npm install`
4. run `gulp watch`
5. run chrome browser and point at `http://localhost:9000`

## just use it - web storm

   (todo)
   
## explore aurelia by looking at [the tests](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-vs-ts-tests)

![tests 03](https://cloud.githubusercontent.com/assets/10272832/6097899/4042e1fc-af8b-11e4-8559-f93fa2bbea93.png)

1. have a look at the [TypeScript test source](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-vs-ts-tests/aurelia-vs-ts-tests/tests/dependency-injection-tests.ts)
3. make sure you have visual studio 2013 Update 4
4. install [typescript 1.4 for Visual Studio 2013](https://visualstudiogallery.msdn.microsoft.com/2d42d8dc-e085-45eb-a30b-3f7d50d55304)
1. run visual studio
2. open solution in `aurelia-vs-ts-tests`
3. run solution using chrome
   
## [bundling](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-require-bundle)

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

1. run `git bash` shell
2. change to `aurelia-vs-ts` folder
3. run `npm install`
4. run `gulp watch`
5. run chrome browser and point at `http://localhost:9000`

## Contributing

We'd love for you to contribute to our source code and to make this project even better than it is today! If this interests you, please begin by reading [our contributing guidelines](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md). The contributing document will provide you with all the information you need to get started. Once you have read that, you will need to also [sign our CLA](http://goo.gl/forms/dI8QDDSyKR) before we can accepts a Pull Request from you. More information on the process is including in the [contributor's guide](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md).
