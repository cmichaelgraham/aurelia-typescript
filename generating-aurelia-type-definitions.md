# Generating Aurelia Type Definitions

Aurelia was authored using ES6 with all the freedom of a dynamically typed language.  Some of the developers using Aurelia may want to leverage TypeScript's advantages in developing their own Aurelia applications.

One of TypeScript's key advantages is (optional) strong typing where the IDE will highlight type errors. This helps users validate proper use of Aurelia's public API.

Another key advantage offered with TypeScript is Intellisense, where the IDE will perform auto-completion of statements based on the valid types.  Again, this helps insure proper use of Aurelia's public API, as well as making the API's features discoverable.

So we knew we wanted TypeScript definition files for Aurelia's public API, but what is the best way to go about creating the type definitions?   What is the process for validating that the type definitions are correct and match the underlying libraries?  And equally important, how will these type definitions be kept up to date as the libraries evolve?

This document is an attempt to describe one possible recipe for answering those very questions.

Lets start with a picture.  This is a graphic overview of the recipe.

![type definitions process](https://cloud.githubusercontent.com/assets/10272832/6794135/b5ceabac-d193-11e4-9a44-b22a2b416db5.png)

## Aurelia Repos

We know whatever process we define must periodically take updates from the Aurelia Repos, so we start with that.

Each library tracks its commits independently.  We'd like a way to see all of the changes since the last pull from the Aurelia Repos.  The solution comes in the fom of a `git bash` shell script called, oddly enough, [get-latest.sh](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-ts-lib/get-latest.sh).

The first part of the script creates a temporary folder, changes to the that folder, and then clones the aurelia libraries.

![get-latest shell 1](https://cloud.githubusercontent.com/assets/10272832/6799039/358ffcd0-d1d8-11e4-8387-d1f6c57cd420.png)

The second part of the script moves up a directory, (recursively) copies each repo's `src` folder into a corresponding repo folder within the `aurelia-latest` folder, and then the temporary directory is removed.

![get-latest shell 2](https://cloud.githubusercontent.com/assets/10272832/6799058/66b41800-d1d8-11e4-986f-cfa4b54efc54.png)

When a shell script of this kind is authored, it must be marked as able to execute.  This is accomplished with the `chmod 755 get-latest.sh` command.

Once it has been marked, it can be executed like this: `./get-latest.sh`.

At this point, we have a nice, concise folder structure with the Aurelia source files in the `aurelia-latest` folder, who's structure looks like this:

![aurelia-latest folders and files](https://cloud.githubusercontent.com/assets/10272832/6794477/c4b8d832-d197-11e4-9473-d15f9ce3ea56.png)

We commit this to github so that the next time we run the script and commit, we can easily view all changes to the Aurelia library.  This is important because the next step is manual, a process that will be described in detail in the next section.

## `.js` ==> `.ts`

So one of the nice things about TypeScript, is that JavaScript `is` TypeScript.  This gives us an easy starting point.  We just copy those folders shown above into the [aurelia-ts](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-ts-lib/aurelia-ts) folder and then rename each JavaScript file, changing the the `.js` file extensions to `.ts`.  Now TypeScript knows that those are TypeScript files.

The resulting folder structure looks like this:

![aurelia-ts folders and files](https://cloud.githubusercontent.com/assets/10272832/6794572/014162c8-d199-11e4-8eee-c8b46a23923c.png)

Now that we have TypeScript versions fo the Aurelia source, we again commit to github.

Our TypeScript code likely has a few issues at this point.  For one thing, since we haven't added type annotations, the only strong typing we have so far are the types that can be inferred by the TypeScript compiler.  In addition, some of our dynamic code causes errors.  The TypeScript compiler complains about code that references properties of a class that have not been declared.

To fix these problems we are going to want to enlist the help of an Integrated Development Environment, or IDE.

You have many IDE choices in today's development world.

This initial recipe was created and tested prior to the release of TypeScript 1.5.  Because of this, the Atom IDE with the Atom-TypeScript package was used as it incorporates the very latest TypeScript compiler code and language services from [github master branch](https://github.com/microsoft/TypeScript).

Here are a few links to help you get started with Atom.

1. [Atom IDE]()
2. [Atom-TypeScript Package](https://github.com/TypeStrong/atom-typescript#atom-typescript)
3. [tsconfig.json](https://github.com/TypeStrong/atom-typescript/blob/master/docs/tsconfig.md)
4. [typescript compiler options](https://github.com/TypeStrong/atom-typescript/blob/e2fa67c4715189b71430f766ed9a92d9fb3255f9/lib/main/tsconfig/tsconfig.ts#L8-L35)

Once you have installed Atom and the Atom-TypeScript package, run Atom and choose `File-Open Folder` and browse to the `aurelia-ts` folder.

This folder contains a `tsconfig.json` file which is a unified project format for TypeScript, and is great for building the compiler context.

`tsconfig.json` lets us control options.  For example, we want to generate type definition (`.d.ts`) files as part of our build.  We want to place these files in an `output` folder.  Here is an example snippet of the `tsconfig.json` file:

```javascript
{
    "version": "1.5.1",
    "compilerOptions": {
        "target": "es6",
        "module": "amd",
        "declaration": true,
        "noImplicitAny": false,
        "removeComments": false,
        "noLib": true,
        "out": "aurelia-ts-bundle.js",
        "outDir": "output"
    },
    "filesGlob": [
        "./**/*.ts",
        "!./node_modules/**/*.ts"
    ]
    
    // ...
}
```

Side Note: Atom comes configured with the Atom Dark theme by default.  This was changed (using `File-Settings-Themes`) to the Atom Light theme to make the screen shots easier to see.

Here is a screen shot of the Atom IDE.  The property declarations and type annotations have been highlighted.

![atom di type annotations](https://cloud.githubusercontent.com/assets/10272832/6800333/080d6cba-d1e3-11e4-90dd-11a19ccc3261.png)

These are the typical edits that must be made to the original Aurelia JavaScript files to successfully compile them using the TypeScript compiler.

Once we can successfully compile the Aurelia Repos, we are ready to move onto the next step.

## Generate Definitions

To generate definitions, we compile the Aurelia Repos using the TypeScript compiler (with the proper options set in the `tsconfig.json` file).  The [`output`](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-ts-lib/aurelia-ts/output) folder is created and filled with a `.d.ts` definition file for each `.ts` file in the source.  The directory structure is preserved and looks like this:

![type definitions output folder](https://cloud.githubusercontent.com/assets/10272832/6800470/66c4e3ea-d1e4-11e4-88d2-b857cf76320f.png)

Notice that the compiler also generated `.js` files for each `.ts` file.  We are not really interested in the `.js` files, and will ignore them when we run our script to copy the `.d.ts` files to our Aurelia project ([`skel-nav-esri-atom`](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-atom)) that consumes them.

Lets have a look at the top part of one of the generated definition files, [`metadata.d.ts`](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-ts-lib/aurelia-ts/output/dependency-injection/metadata.d.ts):

```javascript
/**
* An abstract annotation used to allow functions/classes to indicate how they should be registered with the container.
*
* @class Registration
* @constructor
*/
export declare class Registration {
    /**
    * Called by the container to allow custom registration logic for the annotated function/class.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: any, key: any, fn: any): void;
}
/**
* An annotation used to allow functions/classes to indicate that they should be registered as transients with the container.
*
* @class Transient
* @constructor
* @extends Registration
* @param {Object} [key] The key to register as.
*/
export declare class Transient extends Registration {
    key: any;
    constructor(key: any);
    /**
    * Called by the container to register the annotated function/class as transient.
    *
    * @method register
    * @param {Container} container The container to register with.
    * @param {Object} key The key to register as.
    * @param {Object} fn The function to register (target of the annotation).
    */
    register(container: any, key: any, fn: any): void;
}
```

Notice that the file contains only definitions, and not implementation.  That's a requirement for definition (`.d.ts`) files.  Also notice that the code comments from the original `.js` files (that later became our `.ts` files) are included in the `.d.ts` files.  This is used by many IDE intellisense features to augment what is displayed in popups to include these descriptions.

Now lets have a look at the public API exported by the Aurelia `dependency-injection` repo's [index.d.ts](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-ts-lib/aurelia-ts/output/dependency-injection/index.d.ts) file:

```javascript
export { Registration, Transient, Singleton, Resolver, Lazy, All, Optional, Parent } from './metadata';
export { Container } from './container';
```

Notice that the exported types come from explicit references to other `.d.ts` files.  This form of aggregation and publishing (exporting) is very useful.

So now we have what we need to create the top level `aurelia.d.ts` type definition file.

We use TypeScript's concept of [Ambient Declarations](http://www.typescriptlang.org/Handbook#modules-working-with-other-javascript-libraries) in our recipe when creating `aurelia.d.ts`.

The [`aurelia.d.ts`]() file contains the Ambient Module Declarations as shown here:

```javascript
declare module 'aurelia-metadata' {
    export * from 'metadata/index';
}

declare module 'aurelia-dependency-injection' {
    export * from 'dependency-injection/index';
}

declare module 'aurelia-path' {
    export * from 'path/index';
}

declare module 'aurelia-route-recognizer' {
    export * from 'routeroute-recognizer/index';
}

declare module 'aurelia-event-aggregator' {
    export * from 'event-aggregator/index';
}

declare module 'aurelia-history' {
    export * from 'history/index';
}

declare module 'aurelia-router' {
    export * from 'router/index';
}

declare module 'aurelia-http-client' {
    export * from 'http-client/index';
}
```

These ambient declarations allow us to import classes from the Aurelia public interface using the same, unmodified import statements from the sample [`skeleton-navigation`](https://github.com/aurelia/skeleton-navigation).  Here is an example that consumes the `Router` object from the Aurelia Router Repo.

```javascript
import {Router} from "aurelia-router";

export class Welcome{
    static inject = [Router];
    heading: string;
    constructor(private router: Router){
        this.heading = "Child Router";
        router.configure(config => {
            config.map([
              { route: ["","welcome"],  moduleId: "views/welcome",      nav: true, title:"Welcome" },
              { route: "flickr",        moduleId: "views/flickr",       nav: true },
              { route: "child-router",  moduleId: "views/child-router", nav: true, title:"Child Router" }
            ]);
        });
    }
}
```

Now that we have the definition (`.d.ts`) files created, the next step is to copy them (and the folder structure) to the sample project that will consume them.  For this, we again rely on the trusty `git bash` shell, creating another script, [publish-typedefs.sh](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/aurelia-ts-lib/publish-typedefs.sh), to deploy our type definition assets.  The script looks like this:

```
cd ./aurelia-ts/output
cp -f --parents ./**/*.d.ts ../../../skel-nav-esri-atom/typings/aurelia
cp -f *.d.ts ../../../skel-nav-esri-atom/typings/aurelia
```

Finally, at long last, we are ready to build our Aurelia application using TypeScript !!

## Aurelia Project

Lets start out with a new running instance of the Atom IDE (please refer to above for adding the Atom-TypeScript package, if you haven't already done so).

Using `File-Open Folder`, open the [`skel-nav-esri-atom`](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/skel-nav-esri-atom) folder.

Notice the root folder contains our [`tsconfig.json`](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/skel-nav-esri-atom/tsconfig.json) file.  The settings are slightly different in this one.  We are not sending the output to another folder, but instead generating the `.js` files in the same folder as their `.ts` counterparts.  We are also not generating `.d.ts` files as part of the build process.

Now we can use our public Aurelia API to our hearts content.  Here is an example of the `child-router` view model.  Notice its use of the `Router` class from the `aurelia-router` repo.  Remember how we made this work using ambient declarations above?

```javascript
import {Router} from "aurelia-router";

export class Welcome{
    static inject = [Router];
    heading: string;
    constructor(private router: Router){
        this.heading = "Child Router";
        router.configure(config => {
            config.map([
              { route: ["","welcome"],  moduleId: "views/welcome",      nav: true, title:"Welcome" },
              { route: "flickr",        moduleId: "views/flickr",       nav: true },
              { route: "child-router",  moduleId: "views/child-router", nav: true, title:"Child Router" }
            ]);
        });
    }
}
```

We can use types from any of the other Aurelia Repos we've processed.  Here is an example of the `flickr` view model.

```javascript
import {HttpClient} from "aurelia-http-client";

var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json";

export class Flickr {
    public heading: string;
    public images: Array<any>;
    static inject = [HttpClient];
    constructor(private http: HttpClient) {
        this.heading = "Flickr";
        this.images = [];
    }

    activate() {
        return this.http.jsonp(url).then(response => {
            this.images = response.content.items;
        });
    }

    canDeactivate() {
        return confirm("Are you sure you want to leave?");
    }
}
```

The list of Aurelia Repos processed so far include:

1. dependency-injection
2. event-aggreagator
3. history
4. http-client
5. metadata
6. path
7. route-recognizer
8. router
