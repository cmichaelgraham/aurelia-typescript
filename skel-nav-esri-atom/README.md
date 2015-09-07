# Atom IDE Sample: Aurelia / TypeScript / ESRI Map

## Description

For our sample, we'll choose to use an existing AMD bundle of the Aurelia libraries and the Dojo AMD loader, so we can easily include an [ESRI map](https://developers.arcgis.com/javascript/) in our sample application.

We will use the [Atom IDE](https://atom.io/) and [Atom-TypeScript package](https://github.com/TypeStrong/atom-typescript#atom-typescript) to build the source TypeScript code, and we will use [Gulp](http://gulpjs.com/) and [Node](https://nodejs.org/) to serve the website.

## tsconfig.json

```javascript
{
    "version": "1.5.3",
    "compilerOptions": {
        "target": "es5",
        "module": "amd",
        "declaration": false,
        "noImplicitAny": false,
        "removeComments": false,
        "noLib": true,
        "emitDecoratorMetadata": true
    },
    "filesGlob": [
        "./**/*.ts",
        "!./node_modules/**/*.ts"
    ],
    "files": [
      // ... omitted to save space ...
    ]
}
```

#### version

#### target

#### module

#### declaration

#### noImplicitAny

#### removeComments

#### noLib

#### emitDecoratorMetadata

#### filesGlob

