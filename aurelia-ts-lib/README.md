# aurelia-ts-lib

> a spike to attempt to port aurelia code into typescript

## get-latest.sh

> this is a `git bash` script to help keep the aurelia-latest up to date

## process steps

1. run `./get-latest.sh`
  1. clone aurelia repos into `aurelia-latest-repos`
  2. copy `src` folder from each repo into corresponding folder in `aurelia-latest`
3. manually copy `.js` files from `aurelia-latest` into `aurelia-ts` (rename each to `.ts`)
4. rename `index.ts` --> `aurelia-<library name>.ts`
5. replace imports `aurelia-<library name>` --> `./<library name>/aurelia-<library name>`

