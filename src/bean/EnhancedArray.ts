class EnhancedArray<T> extends Array<T>{

    name : string = "";

    constructor(...args : any[]) {
        super(...args);
    }

    remove = (item : T) => {
        this.splice(this.indexOf(item), 1);
    };

    getTop = () => {
        return this[0];
    };

    isEmpty = () => {
        return Boolean(this.length);
    };

    clear = () => {
        this.length = 0;
    };

    static generateFromArray(array : Array<any>) : EnhancedArray<any>{
        let arr = new EnhancedArray();
        arr.push(...array);
        return arr;
    }


}
// @ts-ignore
window.EnhancedArray = EnhancedArray;

export default EnhancedArray;
