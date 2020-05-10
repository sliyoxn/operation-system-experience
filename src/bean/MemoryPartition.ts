class MemoryPartition {
    size : number = 0;
    status : Status = Status.Idle;
    constructor(size : number) {
        this.size = size;
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
