import settings from './settings';
import * as breeze from 'breeze';


var entityManager;

/**
* Creates Breeze EntityManager instances.
*/
export function createEntityManager() {
    if (entityManager) {
        return Promise.resolve(copyEntityManager());
    }

    entityManager = new breeze.EntityManager(settings.serviceName);
    return entityManager.fetchMetadata()
        .then(() => copyEntityManager());
}

function copyEntityManager() {
    var copy = entityManager.createEmptyCopy();
    copy.entityChanged.subscribe(logChanges);
    return copy;
}

// log entity changes to the console for debugging purposes.
function logChanges(data) {
    var message = 'Entity Changed.  Entity: ' + (data.entity ? data.entity.entityType.name + '/' + data.entity.entityAspect.getKey().toString() : '?') + ';  EntityAction: ' + data.entityAction.getName() + '; ';
    if (data.entityAction === breeze.EntityAction.PropertyChange) {
        var pcArgs = data.args;
        message += 'PropertyName: ' + (pcArgs.propertyName || 'null') + '; Old Value: ' + (pcArgs.oldValue ? pcArgs.oldValue.toString() : 'null') + '; New Value: ' + (pcArgs.newValue ? pcArgs.newValue.toString() : 'null') + ';';
    }
    if (data.entityAction === breeze.EntityAction.EntityStateChange) {
        message += 'New State: ' + data.entity.entityAspect.entityState.getName() + ';';
    }
    console.log(message);
};