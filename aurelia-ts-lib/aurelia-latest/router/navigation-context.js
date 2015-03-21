import {REPLACE} from './navigation-plan';

export class NavigationContext {
  constructor(router, nextInstruction) {
    this.router = router;
    this.nextInstruction = nextInstruction;
    this.currentInstruction = router.currentInstruction;
    this.prevInstruction = router.currentInstruction;
  }

  getAllContexts(acc = []) {
    acc.push(this);
    if(this.plan) {
      for (var key in this.plan) {
        this.plan[key].childNavigationContext && this.plan[key].childNavigationContext.getAllContexts(acc);
      }
    }
    return acc;
  }

  get nextInstructions() {
    return this.getAllContexts().map(c => c.nextInstruction).filter(c => c);
  }

  get currentInstructions() {
    return this.getAllContexts().map(c => c.currentInstruction).filter(c => c);
  }

  get prevInstructions() {
    return this.getAllContexts().map(c => c.prevInstruction).filter(c => c);
  }

  commitChanges(waitToSwap) {
    var next = this.nextInstruction,
        prev = this.prevInstruction,
        viewPortInstructions = next.viewPortInstructions,
        router = this.router,
        loads = [],
        delaySwaps = [];

    router.currentInstruction = next;

    if (prev) {
      prev.config.navModel.isActive = false;
    }

    next.config.navModel.isActive = true;

    router.refreshBaseUrl();
    router.refreshNavigation();

    for (var viewPortName in viewPortInstructions) {
      var viewPortInstruction = viewPortInstructions[viewPortName];
      var viewPort = router.viewPorts[viewPortName];

      if(!viewPort){
        throw new Error(`There was no router-view found in the view for ${viewPortInstruction.moduleId}.`);
      }

      if (viewPortInstruction.strategy === REPLACE) {
        if(waitToSwap){
          delaySwaps.push({viewPort, viewPortInstruction});
        }

        loads.push(viewPort.process(viewPortInstruction, waitToSwap).then(x => {
          if ('childNavigationContext' in viewPortInstruction) {
            return viewPortInstruction.childNavigationContext.commitChanges();
          }
        }));
      }else{
        if ('childNavigationContext' in viewPortInstruction) {
          loads.push(viewPortInstruction.childNavigationContext.commitChanges(waitToSwap));
        }
      }
    }

    return Promise.all(loads).then(() => {
      delaySwaps.forEach(x => x.viewPort.swap(x.viewPortInstruction));
    });
  }

  buildTitle(separator=' | ') {
    var next = this.nextInstruction,
        title = next.config.navModel.title || '',
        viewPortInstructions = next.viewPortInstructions,
        childTitles = [];

    for (var viewPortName in viewPortInstructions) {
      var viewPortInstruction = viewPortInstructions[viewPortName];

      if ('childNavigationContext' in viewPortInstruction) {
        var childTitle = viewPortInstruction.childNavigationContext.buildTitle(separator);
        if (childTitle) {
          childTitles.push(childTitle);
        }
      }
    }

    if (childTitles.length) {
      title = childTitles.join(separator) + (title ? separator : '') + title;
    }

    if (this.router.title) {
      title += (title ? separator : '') + this.router.title;
    }

    return title;
  }
}

export class CommitChangesStep {
  run(navigationContext, next) {
    return navigationContext.commitChanges(true).then(() => {
      var title = navigationContext.buildTitle();
      if (title) {
        document.title = title;
      }

      return next();
    });
  }
}
