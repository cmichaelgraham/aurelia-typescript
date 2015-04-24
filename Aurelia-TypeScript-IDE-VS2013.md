# VS 2013 (IDE) Instruction Page

### (Special thank you to @derekpitt for these instructions.)

Working to validate them now on workstation and laptop.

These are the steps to get VS2013 using and outputting TS1.5 with es6 output.

## Get Node installed.

```
npm -g install typescript@1.5.0alpha
```

This should install to ```C:\Users\<USER>\AppData\Roaming\npm\node_modules\typescript```

## Make a copy of ```C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4```
Copy everything from ```C:\Users\<USER>\AppData\Roaming\npm\node_modules\typescript\bin```
and paste it over ```C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4```

This is so the build from VS2013 will actually use 1.5alpha

## run powershell (as admin if needed)

Run this script if needed:

```
Set-ExecutionPolicy -ExecutionPolicy Unrestricted
```

## next, use [this powershell script](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/tsUpdate.ps1):
```
.\tsUpdate.ps1 -enableDevMode -vsVersion 12 -tsScript "C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4"
```

## Ok, VS2013 should now be able to build with ts1.5alpha!

if you are using any type definitions that use ```export = <....>``` change it to ```export default <....>```
the typescript team is still working out es6 modules and all of the definitions out there at https://github.com/Microsoft/TypeScript/issues/2242 so this may change.

we have a gulp build that is on our CI server, but for local dev we also had to manually add ```lib.es6.d.ts``` to our project to get the build working with es6.

# Notes (thanks to @Souldrinker)

TypeScript 1.5 - not that many red underlinings in code except for the decorators.

Slightly different from the above (goal to be able to use TypeScript 1.4 in other projects)

## Change the TypeScriptToolsVersion to 1.5 in the csproj file. 

Which upon compile complained about missing "C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5" folder.

## Make a copy of TS 1.4

Make a copy of `C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4` and call it `C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5` and then overwrite the folders there with the files from the bin folder of the TS1.5 zip file.

After this you will still got squiggly red lines under a lot of stuff in Resharper 9.1 (first version that include experimental TS 1.5 support) since Resharper seem to check the registry rather than using the project file as the studio does.

3) Manual updates to registry

Rather than run the powershell script, manually added the following registry keys under "HKEY_CURRENT_USER\Software\Microsoft\VisualStudio\12.0\TypeScriptLanguageService":

* CustomDefaultES6LibraryLocation => C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\lib.es6.d.ts
* CustomDefaultLibraryLocation => C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\lib.d.ts
* CustomTypeScriptServicesFileLocation => C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.5\typescriptServices.js

After this Resharper seemed much happier and the only thing that still seems red in the editor is the decorators.

## @Souldrinker comments

I'm using ES6 as TypeScriptTarget and use Babel to transpile it with the es6 modules intact, but I suppose ES5/amd would work too. I do however have a slight issue with the Babel transpiling and decorators where it translates this.decorate to undefined.decorate, so to get passed that I had to add the following to my build-ts task:
.pipe(replace("undefined.decorate", "this.decorate")) // hack to make decorators work!

@cmichaelgraham Well I do still get three errors and one warning with my setup described above and it seems to prevent transpile on save, but Ctrl+Shift+B still works and anyway I've set up my build script to use gulp-typescript so it's not a really big issue for me. The errors I get are:
Cannot find global type 'Iterable'.
Cannot find global type 'Symbol'.
Cannot find global type 'Symbol'.

And the warning:
Your project file uses a newer version of the TypeScript compiler and tools than supported by this version of Visual Studio. Your project may be using TypeScript language features that will result in errors when compiling with this version of the TypeScript tools. To remove this warning, remove the <TypeScriptToolsVersion> element from your project file.

But at least I got rid of most of the red stuff in the editor, so until a new version of TypeScript or Visual Studio with better tooling support I'll keep it this way.

## @colindembovsky Method
Here are my steps for getting TypeScript 1.5 to work:

1. Clone the [TypeScript repo](https://github.com/Microsoft/TypeScript)
2. Open a PowerShell command prompt. `cd` to the repo directory and enter the following command (note: use `-vsVersion 12` for VS 2013 or `-vsVersion 14` for VS 2015:
```.\scripts\VSDevMode.ps1 -vsVersion 14 -enableDevMode -tsScript .\bin```
3. Open `C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4` (I'll refer to this as the `root` folder) and create a folder called `1.4`
4. Copy all the files (not folders) in the `root` folder to the `1.4` folder you just created (as a backup)
5. Copy `bin\*.*` from the TypeScript repo into the `root` folder
6. Restart VS
7. I removed the TypeScript version tag from my Web Project files
8. I added `bin\lib.es6.d.ts` to the `Scripts\typings\libes6` folder in my project
9. If you're using Gulp: run `npm install -g typescript@1.5.0alpha` and remember to add `typescript = require('typescript)` to the gulp-typescript options object

### Aurelia
To use Aurelia's "newer" features (like decorators) you'll need to update the Aurelia.d.ts files. Here's a snippet:
```
declare module "aurelia-framework" {
	...
	// decorators
	export function inject(...rest: any[]);
	export function transient();
	export function singleton();
	export function factory();
	export function behavior(override: any);
	export function customElement(name?: string);
	export function customAttribute(name?: string);
	export function useShadowDOM();
	export function useView(path: string);
	export function noView();
	export function templateController();
	export function dynamicOptions();
	export function syncChildren(property: string, changeHandler?: string, selector?: string);
	export function skipContentProcessing();
	export function valueConverter(name: string);
	export function elementConfig();
	...
```
You then need to import the decorator: for example, to inject the Router into a class:
```
import {inject} from "aurelia-framework";
import {Router} from "aurelia-router";

@inject(Router)
export class MyClass {
   ...
}
```

### Reverting back to TypeScript 1.4
I also managed to successfully revert to TypeScript 1.4 (and then re-apply TypeScript 1.5 afterwards) using these steps:

1. Open `regedit` and delete the keys that the `VSDevMode.ps1` script sets up
2. Delete the files (not folders) in the `root` folder (`C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4`)
3. Copy the files from the `1.4` backup folder to the `root` folder
4. Restart VS
4. Revert your `lib.es6.d.ts` file to the `1.4` version (if you need it in your 1.4 project)
5. If you're using Gulp, revert to TypeScript 1.4 package and remove `typescript = require('typescript)` to the gulp-typescript options object
