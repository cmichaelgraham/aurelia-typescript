# aurelia-typescript
A starter kit for working with the Aurelia TypeScript type definitions

This library is part of the [Aurelia](http://www.aurelia.io/) platform.

> To keep up to date on [Aurelia](http://www.aurelia.io/), please visit and subscribe to [the official blog](http://blog.durandal.io/). If you have questions, we invite you to join us on [our Gitter Channel](https://gitter.im/aurelia/discuss).

## just use it - visual studio

## just use it - gulp

## explore aurelia by looking at the tests

## bundling
1. open `git bash shell`
2. install `node.js`
2. install `bower`
3. change to `aurelia-require-bundle` folder
3. get the latest aurelia libraries

---run `bower install`

4. look at the bundling dependencies

--* [manifest of dependencies](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/aurelia-bundle-manifest.js)
--* [bower config](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-require-bundle/bower.json)

5. bundle the files for development

---run `node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.js optimize=none`

6. bundle the files for production (minified)

---run `node r.js -o name=aurelia-bundle-manifest baseUrl=. mainConfigFile=main-config.js out=aurelia-bundle.min.js`

## Contributing

We'd love for you to contribute to our source code and to make this project even better than it is today! If this interests you, please begin by reading [our contributing guidelines](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md). The contributing document will provide you with all the information you need to get started. Once you have read that, you will need to also [sign our CLA](http://goo.gl/forms/dI8QDDSyKR) before we can accepts a Pull Request from you. More information on the process is including in the [contributor's guide](https://github.com/DurandalProject/about/blob/master/CONTRIBUTING.md).
