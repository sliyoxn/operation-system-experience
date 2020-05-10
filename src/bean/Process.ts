class Process {
    public processName: string = "defaultName";
    public readonly executeTime: number = 0;
    public readonly arriveTime: number = 0;
    private startTime: number = 0;
    private endTime: number = 0;

    constructor(processName: string = "", executeTime: number = 0, arriveTime: number = 0) {
        this.processName = processName;
        this.executeTime = executeTime;
        this.arriveTime = arriveTime;
    }

    execute(time: number)  : void {
        this.startTime = time;
        this.endTime = this.startTime + this.executeTime;
    };

    clone() : Process {
        return new Process(this.processName, this.executeTime, this.arriveTime);
    }

    getEndTime() : number {
        return this.endTime;
    }
}

export default Process;
