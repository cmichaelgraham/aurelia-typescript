import {RouteFilterContainer} from './route-filters';

export class RouterConfiguration{
  constructor() {
    this.instructions = [];
    this.options = {};
    this.pipelineSteps = [];
  }

  addPipelineStep(name, step) {
    this.pipelineSteps.push({name, step});
  }

  map(route, config) {
    if (Array.isArray(route)) {
      for (var i = 0; i < route.length; i++) {
        this.map(route[i]);
      }

      return this;
    }

    if (typeof route == 'string') {
      if (!config) {
        config = {};
      } else if (typeof config == 'string') {
        config = { moduleId: config };
      }

      config.route = route;
    } else {
      config = route;
    }

    return this.mapRoute(config);
  }

  mapRoute(config) {
    this.instructions.push(router => {
      if (Array.isArray(config.route)) {
        var navModel = {}, i, ii, current;

        for (i = 0, ii = config.route.length; i < ii; ++i) {
          current = Object.assign({}, config);
          current.route = config.route[i];
          this.configureRoute(router, current, navModel);
        }
      } else {
        this.configureRoute(router, Object.assign({}, config));
      }
    });

    return this;
  }

  mapUnknownRoutes(config) {
    this.unknownRouteConfig = config;
    return this;
  }

  exportToRouter(router) {
    var instructions = this.instructions,
        pipelineSteps = this.pipelineSteps,
        i, ii, filterContainer;

    for (i = 0, ii = instructions.length; i < ii; ++i) {
      instructions[i](router);
    }

    if (this.title) {
      router.title = this.title;
    }

    if (this.unknownRouteConfig) {
      router.handleUnknownRoutes(this.unknownRouteConfig);
    }

    router.options = this.options;

    if (pipelineSteps.length) {
      // Pipeline steps should only be added at the app router
      if (!router.isRoot) {
        throw new Error('Pipeline steps can only be added to the root router');
      }

      filterContainer = router.container.get(RouteFilterContainer);
      for (i = 0, ii = pipelineSteps.length; i < ii; ++i) {
        var {name, step} = pipelineSteps[i];
        filterContainer.addStep(name, step);
      }
    }
  }

  configureRoute(router, config, navModel) {
    this.ensureDefaultsForRouteConfig(config);
    router.addRoute(config, navModel);
  }

  ensureDefaultsForRouteConfig(config) {
    config.name =  ensureConfigValue(config, 'name', this.deriveName);
    config.route = ensureConfigValue(config, 'route', this.deriveRoute);
    config.title = ensureConfigValue(config, 'title', this.deriveTitle);
    config.moduleId = ensureConfigValue(config, 'moduleId', this.deriveModuleId);
  }

  deriveName(config) {
    return config.title || (config.route ? stripParametersFromRoute(config.route) : config.moduleId);
  }

  deriveRoute(config) {
    return config.moduleId || config.name;
  }

  deriveTitle(config) {
    var value = config.name;
    return value ? value.substr(0, 1).toUpperCase() + value.substr(1) : null;
  }

  deriveModuleId(config) {
    return stripParametersFromRoute(config.route);
  }
}

function ensureConfigValue(config, property, getter) {
  var value = config[property];

  if (value || value === '') {
    return value;
  }

  return getter(config);
}

function stripParametersFromRoute(route) {
  var colonIndex = route.indexOf(':');
  var length = colonIndex > 0 ? colonIndex - 1 : route.length;
  return route.substr(0, length);
}