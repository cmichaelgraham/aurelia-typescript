# Aurelia-TypeScript

## Table of Contents

1. [TODO](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#todo)
3. [Plan]()
  1. [`.d.ts` file in each aurelia repo](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#dts-file-in-each-aurelia-repo)
  3. [`aurelia-framework.d.ts` file](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#aurelia-frameworkdts-file)
  3. [`aurelia.d.ts` file](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#aureliadts-aggregate-of-each-repo)
  4. [code comments](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#code-comments)
  5. [external .d.ts files](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#external-dts-files)
2. [IDE Tooling](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#ide-tooling)
2. [External .d.ts Files](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#external-dts-files)
2. [Coverage](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#coverage)
  1. [dependency-injection](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#dependency-injection)
  2. [router](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#router)
  5. [metadata](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#Metadata)
  4. [http-client]()
  6. [framework]()
  3. [Behaviors (Decorators)]()

## TODO

1. :white_check_mark: Pull Request for [exception in TODO sample](https://github.com/aurelia/templating/issues/34)
1. Create Aurelia TypeScript Plan
2. Document Current Coverage
3. Document Missing Coverage in DI, Router, Behaviors (Decorators), and HTTP Client
4. Create `.d.ts` files & update code comments
5. Create unit tests
6. create samples
7. deploy samples to gh pages
8. document samples
5. Create `aurelia-framework.d.ts` aggregator
6. Create `aurelia.d.ts` aggregator

## Plan

### `<Repo>.d.ts` Files

### Code Comments

### `aurelia-framework.d.ts` Aggregate

### `aurelia.d.ts` Aggregate

### External .d.ts Files

1. [Microsoft TypeScript ES6 .d.ts](https://github.com/Microsoft/TypeScript/blob/master/bin/lib.es6.d.ts)

## IDE Tooling

1. [Sublime Text](http://www.sublimetext.com/)
  2. Extension: [Better TypeScript](https://github.com/lavrton/sublime-better-typescript)
2. [ATOM](https://atom.io/)
  3. Extension: [ATOM TypeScript](https://atom.io/packages/atom-typescript)
3. [Visual Studio 2013](https://www.visualstudio.com/products/visual-studio-community-vs) 
  4. [TypeScript Install](http://www.typescriptlang.org/#Download)
4. [WebStorm](https://www.jetbrains.com/webstorm/)
  4. [Built-in TypeScript](https://www.jetbrains.com/webstorm/features/#modern_languages)

## Coverage

organizing the typescript todos.  initial target aurelia libs are: DI, router, behaviors (decorators) and http 

### Dependency-Injection

| Class | Member | code doc'd | .d.ts cr. | unit test | samp. cr. | samp. depl. | samp. doc'd |
| --- | --- | :---: | :---: | :---: | :---: | :---: |  :---: |
| Container | get | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | registerSingleton | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | registerTransient | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | registerInstance | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | registerHandler | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | supportAtScript | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | createChild | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
| Transient |  | :white_check_mark: | :memo: | :memo: | :memo: | :memo: | :memo: |
| Singleton |  | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
| Resolver | base | :heavy_multiplication_x: | :heavy_multiplication_x: | :heavy_multiplication_x: | :heavy_multiplication_x: | :heavy_multiplication_x: |  :heavy_multiplication_x: |
| Lazy --> Resolver | constructor | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | static of | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
| All --> Resolver | constructor | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | static of | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
| Optional --> Resolver | constructor | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | static of | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
| Parent --> Resolver | constructor | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | get | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |
|  | static of | :memo: | :memo: | :memo: | :memo: | :memo: | :memo: |

### Metadata

### Router

### Behaviors

### Decorators

