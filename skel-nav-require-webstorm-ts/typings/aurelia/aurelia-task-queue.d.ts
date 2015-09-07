declare module 'aurelia-task-queue' {
  export interface Callable {
    call(): void;
  }
  export class TaskQueue {
    constructor();
    queueMicroTask(task: Callable | Function): void;
    queueTask(task: Callable | Function): void;
    flushTaskQueue(): void;
    flushMicroTaskQueue(): void;
    onError(error: Error, task: Callable | Function): void;
  }
}