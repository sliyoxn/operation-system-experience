enum EventType {
    FreeMemory = 0,
    ApplyMemory = 1
}
let id = 1;
class Task {
    taskName : string = "";
    taskMemory : number = 0;
    applyMemoryEvent ?: TaskEvent | null = null;
    freeMemoryEvent ?: TaskEvent | null = null;
    readonly taskId : number;
    constructor(taskName : string, taskMemory : number) {
        this.taskName = taskName;
        this.taskMemory = taskMemory;
        this.taskId = id++;
    }

}

class TaskEvent {
    task : Task;
    type : EventType;
    constructor(task : Task, type : EventType) {
        this.task = task;
        this.type = type;
    }
}

export default Task;
export {TaskEvent, EventType};
