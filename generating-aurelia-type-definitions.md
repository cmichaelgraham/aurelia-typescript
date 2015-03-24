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

When a shell script of this kind is authored, it must be marked as able to execute.  This is accomplished with the `chmod 755 get-latest.sh` command.

Once it has been marked, it can be executed like this: `./get-latest.sh`.

At this point, the script will have cloned the latest of the Aurelia Repos from the master branch into a temporary folder.  From each Aurelia Repo, the `src` folder is copied into the `aurelia-latest` folder (shown [here](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-ts-lib/aurelia-latest)).  We keep these files in our github repo, so that when we pull the next time, we can look at the changes that have occured, and update the `.ts` files, a process that will be described in detail shortly.

The resulting folder structure looks like this:

![aurelia-latest folders and files](https://cloud.githubusercontent.com/assets/10272832/6794477/c4b8d832-d197-11e4-9473-d15f9ce3ea56.png)

## `.js` ==> `.ts`

So one of the nice things about TypeScript, is that JavaScript `is` TypeScript.  This gives us an easy starting point.  We just copy those folders shown above into the [aurelia-ts](https://github.com/cmichaelgraham/aurelia-typescript/tree/master/aurelia-ts-lib/aurelia-ts) folder and then rename each JavaScript file, changing the the `.js` file extensions to `.ts`.  Now TypeScript knows that those are TypeScript files.

The resulting folder structure looks like this:

![aurelia-ts folders and files](https://cloud.githubusercontent.com/assets/10272832/6794572/014162c8-d199-11e4-8eee-c8b46a23923c.png)

