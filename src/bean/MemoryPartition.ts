class MemoryPartition {
    size : number = 0;
    status : Status = Status.Idle;
    msg : string = "";
    taskId : number;
    constructor(size : number, taskId : number = 0, status : Status = 0, msg : string = "") {
        this.size = size;
        this.msg = msg;
        this.taskId = taskId;
        this.status = status;
    }
}

enum Status {
    // 空闲
    Idle = 0,
    // 繁忙
    Using = 1
}

export default MemoryPartition;
export {Status};
