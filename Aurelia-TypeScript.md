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
  1. [`.d.ts` file in each aurelia repo](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#dts-file-in-each-aurelia-repo)
  3. [`aurelia-framework.d.ts` file](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#aurelia-frameworkdts-file)
  3. [`aurelia.d.ts` file](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#aureliadts-aggregate-of-each-repo)
  4. [code comments](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#code-comments)
  5. [handling external .d.ts files](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#handling-external-dts-files)
4. [Issues]()
  1. [Tooling and Explicit References](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#tooling-and-explicit-references)
  2. [External .d.ts Files](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/Aurelia-TypeScript.md#external-dts-files)

## TODO

1. :white_check_mark: Pull Request for [exception in TODO sample](https://github.com/aurelia/templating/issues/34)
1. Create Aurelia TypeScript Plan
2. Document Current Coverage
3. Document Missing Coverage in DI, Router, Behaviors (Decorators), and HTTP Client
4. Create `.d.ts` files
5. Create `aurelia-framework.d.ts` aggregator
6. Create `aurelia.d.ts` aggregator

## Coverage

organizing the typescript todos.  initial target aurelia libs are: DI, router, behaviors (decorators) and http 

here's an example for DI...

### Dependency-Injection

| Class | Member | code comments | .d.ts | unit test | sample | working | deployed |
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

### Router

### Behaviors

### Decorators

## Plan

### `.d.ts` File in Each Aurelia Repo

### `aurelia-framework.d.ts` File

### `aurelia.d.ts` Aggregate of Each Repo

### Code Comments

### Handling External .d.ts Files

1. [Microsoft TypeScript ES6](https://github.com/Microsoft/TypeScript/blob/master/bin/lib.es6.d.ts)

### Tooling and Explicit References
