export default class Stack<T> extends Array<T> {
    constructor(...args : any) {
        super(...args);
    }

    getTop = () => {
        return this[this.length - 1];
    };

    // @ts-ignore
    push = (...args : Array<T>) => {
        super.push(...args);
    };

    pop = () : T | undefined => {
        return this.shift();
    }

}
