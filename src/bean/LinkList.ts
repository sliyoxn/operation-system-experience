class ListNode<T> {
    element ?: T;
    prev: ListNode<T> | null;
    next: ListNode<T> | null;

    constructor(element: T) {
        this.element = element;
        this.prev = null;
        this.next = null;
    }
}

class LinkedList<T> {
    private length: number = 0;
    private head: ListNode<T> | null = null;
    private tail: ListNode<T> | null = null;

    constructor() {
    }

    append(element: T): this {
        let node = new ListNode<T>(element);
        // 首次插入
        if (this.head == null || this.tail == null) {
            this.head = node;
            this.tail = node; //NEW
        } else {
            // 其他情况
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        this.length ++;
        return this;
    }

    insert(position: number, element: T) {
        if (position >= 0 && position <= this.length) {
            let node = new ListNode(element);
            let current = this.head;
            let previous: ListNode<T> | null;
            let index = 0;
            if (position === 0) {
                if (this.head == null) {
                    this.head = node;
                    this.tail = node;
                } else {
                    node.next = current;
                    this.head.prev = node;
                    this.head = node;
                }
            } else if (position === this.length) {
                current = this.tail;
                current!.next = node;
                node.prev = current;
                this.tail = node;
            } else {
                while (index++ < position) {
                    previous = current;
                    current = current!.next;
                }
                node.next = current;
                previous!.next = node;
                current!.prev = node; //NEW
                node!.prev = previous!; //NEW
            }
            this.length++;
            return true;
        } else {
            return false;
        }
    };

    removeAt(position: number) {
        if (position > -1 && position < this.length) {
            let current: ListNode<T> | null = this.head;
            let previous: ListNode<T>;
            let index = 0;
            if (position === 0) {
                if (this.length === 1) {
                    this.tail = null;
                } else {
                    this.head!.prev = null;
                }
            } else if (position === this.length - 1) {
                current = this.tail;
                this.tail = current!.prev;
                this.tail!.next = null;
            } else {
                while (index++ < position) {
                    previous = current!;
                    current = current!.next;
                }
                previous!.next = current!.next;
                current!.next!.prev = previous!;
            }
            this.length--;
            return current!.element;
        } else {
            return null;
        }
    };

    remove(element: T) {
        let index: number = this.indexOf(element);
        return this.removeAt(index);
    };

    indexOf(element: T): number {
        if (this.length === 0) return -1;
        let current: ListNode<T> = this.head!;
        let index = -1;
        if (element == current.element) {
            return 0;
        }
        index++;
        while (current.next) {
            if (element == current.element) {
                return index;
            }
            current = current.next;
            index++;
        }
        if (element == current.element) {
            return index;
        }
        return -1;
    };




    isEmpty(): boolean {
        return this.length === 0;
    };

    size() {
        return this.length;
    };

    toString() {
        let current = this.head!;
        let s = current ? current.element : '';
        while (current && current.next) {
            current = current.next;
            s += ', ' + current.element;
        }
        return s;
    };

    inverseToString() {
        let current = this.tail;
        let s = current ? current.element : '';
        while (current && current.prev) {
            current = current.prev;
            s += ', ' + current.element;
        }
        return s;
    };


    print() {
        console.log(this.toString());
    };

    printInverse() {
        console.log(this.inverseToString());
    };

    getHead() {
        return this.head;
    };

    getTail() {
        return this.tail;
    }


    getNodeByElement(element: T): ListNode<T> | null {
        if (this.length === 0) return null;
        let current: ListNode<T> = this.head!;
        if (element == current.element) {
            return current;
        }
        while (current.next) {
            if (element == current.element) {
                return current;
            }
            current = current.next;
        }
        if (element == current.element) {
            return current;
        }
        return null;
    }


    * [Symbol.iterator]() {
        let current = this.head;
        while (current) {
            yield current.element;
            current = current.next;
        }
    }

    sort(fn : (a: T, b: T) => number) {
        if (this.isEmpty()) return;
        // @ts-ignore
        let arr : Array<T> = [...this];
        arr.sort(fn);
        console.log(arr);
        let newList = this.generateLinkList(arr);
        console.log(newList);
        this.head = newList.head;
        this.tail = newList.tail;
        this.length = newList.length;
    }

    generateLinkList(iterable : Array<T>) {
        let linkedList = new LinkedList<T>();
        for (let i = 0; i < iterable.length; i++) {
            linkedList.append(iterable[i]);
        }
        return linkedList;
    }




}


export default LinkedList;
