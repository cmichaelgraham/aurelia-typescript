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
