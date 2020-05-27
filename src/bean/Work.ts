export default class Work {
    public readonly workName : string = "";
    public readonly arriveTime : number;
    public readonly executeTime : number;
    public hasExecuteTime : number = 0;
    private readonly times : number[] = [];
    constructor(workName : string, arriveTime : number, executeTime : number) {
        this.workName = workName;
        this.arriveTime = arriveTime;
        this.executeTime = executeTime;
    }

    executeAS(time : number) {
        this.hasExecuteTime++;
        this.times.push(time);
    }

    get timeSli() {
        return this.times.join(",");
    }

}
