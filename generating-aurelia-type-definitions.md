# Generating Aurelia Type Definitions

Aurelia was authored using ES6 with all the freedom of a dynamically typed language.  Some of the developers using Aurelia may want to leverage TypeScript's advantages in developing their own Aurelia applications.

One of TypeScript's key advantages is (optional) strong typing where the IDE will highlight type errors. This helps users validate proper use of Aurelia's public API.

Another key advantage offered with TypeScript is Intellisense, where the IDE will perform auto-completion of statements based on the valid types.  Again, this helps insure proper use of Aurelia's public API, as well as making the API's features discoverable.

So we knew we wanted TypeScript definition files for Aurelia's public API, but what is the best way to go about creating the type definitions?   What is the process for validating that the type definitions are correct and match the underlying libraries?  And equally important, how will these type definitions be kept up to date as the libraries evolve?

This document is an attempt to describe one possible recipe for answering those very questions.

Lets start with a picture.  This is a graphic overview of the recipe.

![type definitions process](https://cloud.githubusercontent.com/assets/10272832/6794135/b5ceabac-d193-11e4-9a44-b22a2b416db5.png)
