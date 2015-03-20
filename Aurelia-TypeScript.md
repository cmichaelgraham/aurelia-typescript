# Aurelia-TypeScript

## Table of Contents

1. [TODO](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#todo)
2. [Coverage](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#coverage)
  1. [aurelia-dependency-injection](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#dependency-injection)
  2. [aurelia-router](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#router)
  3. [Behaviors (Decorators)]()
  4. [aurelia-http-client]()
  5. [aurelia-metadata](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#Metadata)
  6. [aurelia-framework]()
3. [Plan]()
  1. `.d.ts` files
  2. `aurelia-framework.d.ts` file
  3. `aurelia.d.ts` file
  4. code comments (class, method, parameter type info)
4. [Issues]()
  1. Tooling and Explicit References

## TODO

1. :white_check_mark: Pull Request for [exception in TODO sample](https://github.com/aurelia/templating/issues/34)
1. Create Aurelia TypeScript Plan
2. Document Current Coverage
3. Document Missing Coverage in DI, Router, Behaviors (Decorators), and HTTP Client
4. Create `.d.ts` files
5. Create `aurelia-framework.d.ts` aggregator
6. Create `aurelia.d.ts` aggregator

## Coverage

### Dependency-Injection

1. Container
  1. get
  2. registerSingleton
  3. registerTransient
  4. registerInstance
  5. registerHandler
  6. supportAtScript
  7. createChild
2. Transient
3. Singleton
4. Resolver
  1. get
5. Lazy --> Resolver
  1. constructor
  2. static of
6. All --> Resolver
  1. constructor
  2. static of
7. Optional --> Resolver
  1. constructor
  2. static of
8. Parent --> Resolver
  1. constructor
  2. get
  2. static of

### Router

### Behaviors

### Decorators

## Plan

### `.d.ts` files
1. `<lib>.d.ts` in each repo
2. `aurelia.d.ts` aggregate of each repo

## Issues

### Tooling and Explicit References
