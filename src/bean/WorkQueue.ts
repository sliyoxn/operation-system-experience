import EnhancedArray from "@/bean/EnhancedArray";
import Work from "@/bean/Work";



export default class WorkQueue {

    public readonly queue : Queue<Work> = new Queue<Work>();
    public readonly timeSlice : number;
    public readonly queueName ?: string = "";
    constructor(queueName : string, timeSlice : number) {
        this.timeSlice = timeSlice;
        this.queueName = queueName;
    }

    public addWork = (...args : Array<Work>) => {
        this.queue.enqueue(...args);
    };
    public deWork = () => {
        return this.queue.shift();
    }


}


class Queue<T> extends EnhancedArray<T>{
    enqueue = (...args : Array<T>) : Queue<T> => {
        if (args.length === 1) {
            // console.log(args[0]);
            this.push(args[0]);
            // console.log(this);
        } else {
            this.push(...args);
        }
        return this;
    };
    dequeue = () : T | undefined => {
        return this.shift();
    }
}
