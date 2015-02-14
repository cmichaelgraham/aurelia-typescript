# Sample using Visual Studio / TypeScript / requirejs amd aurelia bundle

## markdown editor / attached behavior

![markdown works](https://cloud.githubusercontent.com/assets/10272832/6199638/7aae7996-b40e-11e4-9c9e-205b6316d2b9.png)

uses [attached behavior](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/pwkad-aurelia-samples/pwkad-aurelia-samples/views/markdown.editor.html#L11) strategy

[updates innerHTML](https://github.com/cmichaelgraham/aurelia-typescript/blob/master/pwkad-aurelia-samples/pwkad-aurelia-samples/views/markdown-component.ts#L31-L35) when the `value` property it exposes, changes

### import the attached behavior and bind it to the editor text

```
<template>
    <import from='./markdown-component'></import>

    <div class="container-fluid">
        <h2>Markdown Editor</h2>
        <div class="row">
            <div class="col-sm-6">
                <textarea type="text" value.bind="myMarkdownText" class="form-control" rows="20"></textarea>
            </div>
            <div class="col-sm-6">
                <div markdown-component.bind="myMarkdownText"></div>
            </div>
        </div>
    </div>
</template>
```

### register the valueChanged event

```
export class MarkdownComponentAttachedBehavior {
    static metadata() {
        return auf.Behavior
            .attachedBehavior('markdown-component')
            .withProperty('value', 'valueChanged', 'markdown-component');
    }
```

### handle the valueChanged event
```
    valueChanged(newValue) {
        this.element.innerHTML = this.conv.makeHtml(
            newValue.split('\n').map((line) => line.trim()).join('\n')
            );
        prism.highlightAll(this.element.querySelectorAll('code'));
    }
```
