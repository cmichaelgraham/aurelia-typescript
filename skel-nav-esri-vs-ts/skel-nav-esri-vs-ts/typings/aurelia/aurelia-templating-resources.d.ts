declare module 'aurelia-templating-resources' {
  import * as LogManager from 'aurelia-logging';
  import { bindingMode, EventManager, sourceContext, createOverrideContext, BindingBehavior, ValueConverter, valueConverter, ObserverLocator }  from 'aurelia-binding';
  import { ViewResources, resource, ViewCompileInstruction, useView, customElement, bindable, customAttribute, TargetInstruction, BoundViewFactory, ViewSlot, templateController, Animator, CompositionEngine, noView, ViewEngine }  from 'aurelia-templating';
  import { Loader }  from 'aurelia-loader';
  import { Container, inject }  from 'aurelia-dependency-injection';
  import { relativeToFile }  from 'aurelia-path';
  import { DOM, FEATURE }  from 'aurelia-pal';
  import { TaskQueue }  from 'aurelia-task-queue';
  
  /**
  * A strategy is for repeating a template over an iterable or iterable-like object.
  */
  export interface RepeatStrategy {
    instanceChanged(repeat: Repeat, items: any): void;
    instanceMutated(repeat: Repeat, items: any, changes: any): void;
    getCollectionObserver(observerLocator: any, items: any): any;
  }
  
  /**
  * A strategy for repeating a template over null or undefined (does nothing)
  */
  export class NullRepeatStrategy {
    instanceChanged(repeat: any, items: any): any;
    getCollectionObserver(observerLocator: any, items: any): any;
  }
  export class UpdateTriggerBindingBehavior {
    static inject: any;
    constructor(eventManager: any);
    bind(binding: any, source: any, ...events: any[]): any;
    unbind(binding: any, source: any): any;
  }
  export class BindingSignaler {
    signals: any;
    signal(name: string): void;
  }
  export class DebounceBindingBehavior {
    bind(binding: any, source: any, delay?: any): any;
    
    //  should not delay initial target update that occurs during bind.
    unbind(binding: any, source: any): any;
  }
  export class ThrottleBindingBehavior {
    bind(binding: any, source: any, delay?: any): any;
    unbind(binding: any, source: any): any;
  }
  class ModeBindingBehavior {
    constructor(mode: any);
    bind(binding: any, source: any, lookupFunctions: any): any;
    unbind(binding: any, source: any): any;
  }
  export class OneTimeBindingBehavior extends ModeBindingBehavior {
    constructor();
  }
  export class OneWayBindingBehavior extends ModeBindingBehavior {
    constructor();
  }
  export class TwoWayBindingBehavior extends ModeBindingBehavior {
    constructor();
  }
  
  /**
  * Default Html Sanitizer to prevent script injection.
  */
  export class HTMLSanitizer {
    
    /**
      * Sanitizes the provided input.
      * @param input The input to be sanitized.
      */
    sanitize(input: any): any;
  }
  class CSSResource {
    constructor(address: string);
    initialize(container: Container, target: Function): void;
    register(registry: ViewResources, name?: string): void;
    load(container: Container): Promise<CSSResource>;
  }
  class CSSViewEngineHooks {
    constructor(mode: string);
    beforeCompile(content: DocumentFragment, resources: ViewResources, instruction: ViewCompileInstruction): void;
  }
  
  /**
  * Attribute to be placed on any HTML element in a view to emit the View instance
  * to the debug console, giving you insight into the live View instance, including
  * all child views, live bindings, behaviors and more.
  */
  export class ViewSpy {
    
    /**
      * Creates a new instance of ViewSpy.
      */
    constructor();
    
    /**
      * Invoked when the target view is created.
      * @param view The target view.
      */
    created(view: any): any;
    
    /**
      * Invoked when the target view is bound.
      * @param bindingContext The target view's binding context.
      */
    bind(bindingContext: any): any;
    
    /**
      * Invoked when the target element is attached to the DOM.
      */
    attached(): any;
    
    /**
      * Invoked when the target element is detached from the DOM.
      */
    detached(): any;
    
    /**
      * Invoked when the target element is unbound.
      */
    unbind(): any;
  }
  
  /**
  * Attribute to be placed on any element to have it emit the View Compiler's
  * TargetInstruction into the debug console, giving you insight into all the
  * parsed bindings, behaviors and event handers for the targeted element.
  */
  export class CompileSpy {
    
    /**
      * Creates and instanse of CompileSpy.
      * @param element target element on where attribute is placed on.
      * @param instruction instructions for how the target element should be enhanced.
      */
    constructor(element: any, instruction: any);
  }
  
  /**
  * CustomAttribute that binds provided DOM element's focus attribute with a property on the viewmodel.
  */
  export class Focus {
    
    /**
      * Creates an instance of Focus.
      * @paramelement Target element on where attribute is placed on.
      * @param taskQueue The TaskQueue instance.
      */
    constructor(element: any, taskQueue: any);
    
    /**
      * Invoked everytime the bound value changes.
      * @param newValue The new value.
      */
    valueChanged(newValue: any): any;
    
    /**
      * Invoked when the attribute is attached to the DOM.
      */
    attached(): any;
    
    /**
      * Invoked when the attribute is detached from the DOM.
      */
    detached(): any;
  }
  
  /**
  * Marks any part of a view to be replacable by the consumer.
  */
  export class Replaceable {
    
    /**
      * @param viewFactory target The factory generating the view.
      * @param viewSlot viewSlot The slot the view is injected in to.
      */
    constructor(viewFactory: any, viewSlot: any);
    
    /**
      * Binds the replaceable to the binding context and override context.
      * @param bindingContext The binding context.
      * @param overrideContext An override context for binding.
      */
    bind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Unbinds the replaceable.
      */
    unbind(): any;
  }
  
  /**
  * Binding to conditionally show markup in the DOM based on the value.
  * - different from "if" in that the markup is still added to the DOM, simply not shown.
  */
  export class Show {
    
    /**
      * Creates a new instance of Show.
      * @param element Target element to conditionally show.
      * @param animator The animator that conditionally adds or removes the aurelia-hide css class.
      */
    constructor(element: any, animator: any);
    
    /**
      * Invoked everytime the bound value changes.
      * @param newValue The new value.
      */
    valueChanged(newValue: any): any;
    
    /**
      * Binds the Show attribute.
      */
    bind(bindingContext: any): any;
  }
  
  /**
  * Creates a binding context for decandant elements to bind to.
  */
  export class With {
    
    /**
      * Creates an instance of With.
      * @param viewFactory The factory generating the view.
      * @param viewSlot The slot the view is injected in to.
      */
    constructor(viewFactory: any, viewSlot: any);
    
    /**
      * Binds the With with provided binding context and override context.
      * @param bindingContext The binding context.
      * @param overrideContext An override context for binding.
      */
    bind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Invoked everytime the bound value changes.
      * @param newValue The new value.
      */
    valueChanged(newValue: any): any;
    
    /**
      * Unbinds With
      */
    unbind(): any;
  }
  
  /**
  * Binding to conditionally include or not include template logic depending on returned result
  * - value should be Boolean or will be treated as such (truthy / falsey)
  */
  export class If {
    
    /**
      * Creates an instance of If.
      * @param {BoundViewFactory} viewFactory The factory generating the view
      * @param {ViewSlot} viewSlot The slot the view is injected in to
      * @param {TaskQueue} taskQueue
      */
    constructor(viewFactory: any, viewSlot: any, taskQueue: any);
    
    /**
      * Binds the if to the binding context and override context
      * @param bindingContext The binding context
      * @param overrideContext An override context for binding.
      */
    bind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Invoked everytime value property changes.
      * @param newValue The new value
      */
    valueChanged(newValue: any): any;
    
    /**
      * Unbinds the if
      */
    unbind(): any;
  }
  
  /**
  * Used to compose a new view / view-model template or bind to an existing instance.
  */
  export class Compose {
    model: any;
    view: any;
    viewModel: any;
    
    /**
      * Creates an instance of Compose.
      * @param element The Compose element.
      * @param container The dependency injection container instance.
      * @param compositionEngine CompositionEngine instance to compose the element.
      * @param viewSlot The slot the view is injected in to.
      * @param viewResources Collection of resources used to compile the the view.
      * @param taskQueue The TaskQueue instance.
      */
    constructor(element: any, container: any, compositionEngine: any, viewSlot: any, viewResources: any, taskQueue: any);
    
    /**
      * Used to set the bindingContext.
      *
      * @param {bindingContext} bindingContext The context in which the view model is executed in.
      * @param {overrideContext} overrideContext The context in which the view model is executed in.
      */
    bind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Unbinds the Compose.
      */
    unbind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Invoked everytime the bound model changes.
      * @param newValue The new value.
      * @param oldValue The old value.
      */
    modelChanged(newValue: any, oldValue: any): any;
    
    /**
      * Invoked everytime the bound view changes.
      * @param newValue The new value.
      * @param oldValue The old value.
      */
    viewChanged(newValue: any, oldValue: any): any;
    
    /**
        * Invoked everytime the bound view model changes.
        * @param newValue The new value.
        * @param oldValue The old value.
        */
    viewModelChanged(newValue: any, oldValue: any): any;
  }
  
  /**
  * Update the override context.
  * @param startIndex index in collection where to start updating.
  */
  export function updateOverrideContexts(views: any, startIndex: any): any;
  
  /**
    * Creates a complete override context.
    * @param data The item's value.
    * @param index The item's index.
    * @param length The collections total length.
    * @param key The key in a key/value pair.
    */
  export function createFullOverrideContext(repeat: any, data: any, index: any, length: any, key: any): any;
  
  /**
  * Updates the override context.
  * @param context The context to be updated.
  * @param index The context's index.
  * @param length The collection's length.
  */
  export function updateOverrideContext(overrideContext: any, index: any, length: any): any;
  
  /**
  * Gets a repeat instruction's source expression.
  */
  export function getItemsSourceExpression(instruction: any, attrName: any): any;
  
  /**
  * Unwraps an expression to expose the inner, pre-converted / behavior-free expression.
  */
  export function unwrapExpression(expression: any): any;
  
  /**
  * Returns whether an expression has the OneTimeBindingBehavior applied.
  */
  export function isOneTime(expression: any): any;
  export class SignalBindingBehavior {
    static inject(): any;
    signals: any;
    constructor(bindingSignaler: any);
    bind(binding: any, source: any, name: any): any;
    unbind(binding: any, source: any): any;
  }
  
  /**
  * Simple html sanitization converter to preserve whitelisted elements and attributes on a bound property containing html.
  */
  export class SanitizeHTMLValueConverter {
    
    /**
       * Creates an instanse of the value converter.
       * @param sanitizer The html sanitizer.
       */
    constructor(sanitizer: any);
    
    /**
      * Process the provided markup that flows to the view.
      * @param untrustedMarkup The untrusted markup to be sanitized.
      */
    toView(untrustedMarkup: any): any;
  }
  
  /**
  * A strategy for repeating a template over an array.
  */
  export class ArrayRepeatStrategy {
    
    /**
      * Process the provided array items.
      * @param items The underlying array.
      */
    instanceChanged(repeat: any, items: any): any;
    
    /**
      * Gets an Array observer.
      * @param items The items to be observed.
      */
    getCollectionObserver(observerLocator: any, items: any): any;
    
    /**
      * Handles changes to the underlying array.
      * @param array The modified array.
      * @param splices Records of array changes.
      */
    instanceMutated(repeat: any, array: any, splices: any): any;
  }
  
  /**
  * A strategy for repeating a template over a Map.
  */
  export class MapRepeatStrategy {
    
    /**
      * Gets a Map observer.
      * @param items The items to be observed.
      */
    getCollectionObserver(observerLocator: any, items: any): any;
    
    /**
      * Process the provided Map entries.
      * @param items The entries to process.
      */
    instanceChanged(repeat: any, items: any): any;
    
    /**
      * Handle changes in a Map collection.
      * @param map The underlying Map collection.
      * @param records The change records.
      */
    instanceMutated(repeat: any, map: any, records: any): any;
  }
  
  /**
  * A strategy for repeating a template over a number.
  */
  export class NumberRepeatStrategy {
    
    /**
      * Return the strategies collection observer. In this case none.
      */
    getCollectionObserver(): any;
    
    /**
      * Process the provided Number.
      * @param value The Number of how many time to iterate.
      */
    instanceChanged(repeat: any, value: any): any;
  }
  
  /**
  * Locates the best strategy to best repeating a template over different types of collections.
  * Custom strategies can be plugged in as well.
  */
  export class RepeatStrategyLocator {
    
    /**
      * Creates a new RepeatStrategyLocator.
      */
    constructor();
    
    /**
      * Adds a repeat strategy to be located when repeating a template over different collection types.
      * @param strategy A repeat strategy that can iterate a specific collection type.
      */
    addStrategy(matcher: ((items: any) => boolean), strategy: RepeatStrategy): any;
    
    /**
      * Gets the best strategy to handle iteration.
      */
    getStrategy(items: any): RepeatStrategy;
  }
  
  /*eslint no-loop-func:0, no-unused-vars:0*/
  /**
  * Binding to iterate over iterable objects (Array, Map and Number) to genereate a template for each iteration.
  */
  export class Repeat {
    items: any;
    local: any;
    key: any;
    value: any;
    
    /**
     * Creates an instance of Repeat.
     * @param viewFactory The factory generating the view
     * @param instruction The instructions for how the element should be enhanced.
     * @param viewResources Collection of resources used to compile the the views.
     * @param viewSlot The slot the view is injected in to.
     * @param observerLocator The observer locator instance.
     * @param collectionStrategyLocator The strategy locator to locate best strategy to iterate the collection.
     */
    constructor(viewFactory: any, instruction: any, viewSlot: any, viewResources: any, observerLocator: any, strategyLocator: any);
    call(context: any, changes: any): any;
    
    /**
      * Binds the repeat to the binding context and override context.
      * @param bindingContext The binding context.
      * @param overrideContext An override context for binding.
      */
    bind(bindingContext: any, overrideContext: any): any;
    
    /**
      * Unbinds the repeat
      */
    unbind(): any;
    processItemsByStrategy(): any;
    
    /**
      * Invoked everytime the item property changes.
      */
    itemsChanged(): any;
    
    /**
      * Invoked when the underlying collection changes.
      */
    handleCollectionMutated(collection: any, changes: any): any;
    
    /**
      * Invoked when the underlying inner collection changes.
      */
    handleInnerCollectionMutated(collection: any, changes: any): any;
  }
}