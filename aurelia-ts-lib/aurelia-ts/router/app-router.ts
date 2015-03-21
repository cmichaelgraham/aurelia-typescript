import {Container} from 'aurelia-dependency-injection';
import {History} from 'aurelia-history';
import {Router} from './router';
import {PipelineProvider} from './pipeline-provider';
import {isNavigationCommand} from './navigation-commands';
import {EventAggregator} from 'aurelia-event-aggregator';

export class AppRouter extends Router {
  static inject(){ return [Container, History, PipelineProvider, EventAggregator]; }
  constructor(container, history, pipelineProvider, events) {
    super(container, history);
    this.pipelineProvider = pipelineProvider;
    document.addEventListener('click', handleLinkClick.bind(this), true);
    this.events = events;
  }

  get isRoot() {
    return true;
  }

  loadUrl(url) {
    return this.createNavigationInstruction(url).
      then(instruction => this.queueInstruction(instruction)).
      catch(error => {
        console.error(error);

        if (this.history.previousFragment) {
          this.navigate(this.history.previousFragment, false);
        }
      });
  }

  queueInstruction(instruction) {
    return new Promise(resolve => {
      instruction.resolve = resolve;
      this.queue.unshift(instruction);
      this.dequeueInstruction();
    });
  }

  dequeueInstruction() {
    if (this.isNavigating) {
      return;
    }

    var instruction = this.queue.shift();
    this.queue = [];

    if (!instruction) {
      return;
    }

    this.isNavigating = true;
    this.events.publish('router:navigation:processing', instruction);

    var context = this.createNavigationContext(instruction);
    var pipeline = this.pipelineProvider.createPipeline(context);

    pipeline.run(context).then(result => {
      this.isNavigating = false;

      if (result.completed) {
        this.history.previousFragment = instruction.fragment;
      }

      if (result.output instanceof Error) {
        console.error(result.output);
        this.events.publish('router:navigation:error', { instruction, result });
      }

      if (isNavigationCommand(result.output)) {
        result.output.navigate(this);
      } else if (!result.completed) {
        this.navigate(this.history.previousFragment || '', false);
        this.events.publish('router:navigation:cancelled', instruction)
      }

      instruction.resolve(result);
      this.dequeueInstruction();
    })
    .then(result => this.events.publish('router:navigation:complete', instruction))
    .catch(error => {
      console.error(error);
    });
  }

  registerViewPort(viewPort, name) {
    super.registerViewPort(viewPort, name);

    if (!this.isActive) {
      if('configureRouter' in this.container.viewModel){
        var result = this.container.viewModel.configureRouter() || Promise.resolve();
        return result.then(() => this.activate());
      }else{
        this.activate();
      }
    } else {
      this.dequeueInstruction();
    }
  }

  activate(options) {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.options = Object.assign({ routeHandler: this.loadUrl.bind(this) }, this.options, options);
    this.history.activate(this.options);
    this.dequeueInstruction();
  }

  deactivate() {
    this.isActive = false;
    this.history.deactivate();
  }

  reset() {
    super.reset();
    this.queue = [];
    this.options = null;
  }
}

function findAnchor(el) {
  while (el) {
    if (el.tagName === "A") return el;
    el = el.parentNode;
  }
}

function handleLinkClick(evt) {
  if (!this.isActive) {
    return;
  }

  var target = findAnchor(evt.target);
  if (!target) {
    return;
  }

  if (this.history._hasPushState) {
    if (!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && targetIsThisWindow(target)) {
      var href = target.getAttribute('href');

      // Ensure the protocol is not part of URL, meaning its relative.
      // Stop the event bubbling to ensure the link will not cause a page refresh.
      if (href !== null && !(href.charAt(0) === "#" || (/^[a-z]+:/i).test(href))) {
        evt.preventDefault();
        this.history.navigate(href);
      }
    }
  }
}

function targetIsThisWindow(target) {
  var targetWindow = target.getAttribute('target');

  return !targetWindow ||
    targetWindow === window.name ||
    targetWindow === '_self' ||
    (targetWindow === 'top' && window === window.top);
}
