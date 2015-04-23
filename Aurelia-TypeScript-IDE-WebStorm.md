# WebStorm (IDE) Instruction Page

## Install WebStorm

Visit the [jetbrains webstorm](https://www.jetbrains.com/webstorm) website and initiate the install.

## WebStorm TypeScript Links

* [WebStorm TypeScript](https://www.jetbrains.com/webstorm/help/typescript-support.html)
* [Transpiling TypeScript to JavaScript](https://www.jetbrains.com/webstorm/help/transpiling-typescript-to-javascript.html)

## Configure TypeScript Settings

Visit File - Settings - Languages & Frameworks - TypeScript

![webstorm typescript settings](https://cloud.githubusercontent.com/assets/10272832/7301788/23eaba4c-e9a2-11e4-8494-acb0adb5c290.jpg)

Install the TypeScript 1.5 Alpha (or other desired version)

```
npm install microsoft/typescript
```

Click the `Edit` button to change the `Compiler version`.  Browse to the `bin` folder

![webstorm typescript settings compiler selection](https://cloud.githubusercontent.com/assets/10272832/7295591/b515df48-e974-11e4-8479-68b90265cff7.jpg)

## Compile the TypeScript Code

Open the TypeScript Compiler Tool Window (`View | Tool Windows | TypeScript Compiler`), and click the `Compile All` button on the toolbar.

If you have not opened the TypeScript Compiler Tool Window yet and it is not available from the View menu, choose `Help | Find Action`, then find and launch the `TypeScript Compile All` action from the list.
