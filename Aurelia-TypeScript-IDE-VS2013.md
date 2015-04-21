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
.\tsUpdate.ps1 -enableDevMode -vsVersion 12 -tsScript C:\Program Files (x86)\Microsoft SDKs\TypeScript\1.4
```

## Ok, VS2013 should now be able to build with ts1.5alpha!

if you are using any type definitions that use ```export = <....>``` change it to ```export default <....>```
the typescript team is still working out es6 modules and all of the definitions out there at https://github.com/Microsoft/TypeScript/issues/2242 so this may change.

we have a gulp build that is on our CI server, but for local dev we also had to manually add ```lib.es6.d.ts``` to our project to get the build working with es6.
