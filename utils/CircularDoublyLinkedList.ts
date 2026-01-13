class CDLLNode<T> {
    value: T;
    next: CDLLNode<T>;
    prev: CDLLNode<T>;

    constructor(value: T) {
        this.value = value;
        this.next = this;
        this.prev = this;
    }
}

export default class CircularDoublyLinkedList<T> {
    private head: CDLLNode<T> | null = null;
    private _size = 0;

    get size(): number {
        return this._size;
    }

    isEmpty(): boolean {
        return this._size === 0;
    }

    toArray(): T[] {
        if (!this.head) return [];
        const result: T[] = [];
        let curr = this.head;
        do {
            result.push(curr.value);
            curr = curr.next;
        } while (curr !== this.head);
        return result;
    }

    append(value: T): void {
        const node = new CDLLNode(value);

        if (!this.head) {
            this.head = node;
        } else {
            const tail = this.head.prev;

            tail.next = node;
            node.prev = tail;

            node.next = this.head;
            this.head.prev = node;
        }

        this._size++;
    }

    prepend(value: T): void {
        this.append(value);
        this.head = this.head!.prev; // new node becomes head
    }

    find(predicate: (value: T) => boolean): CDLLNode<T> | null {
        if (!this.head) return null;

        let curr = this.head;
        do {
            if (predicate(curr.value)) return curr;
            curr = curr.next;
        } while (curr !== this.head);

        return null;
    }

    remove(value: T): boolean {
        if (!this.head) return false;

        let curr = this.head;

        do {
            if (curr.value === value) {
                if (this._size === 1) {
                    this.head = null;
                } else {
                    curr.prev.next = curr.next;
                    curr.next.prev = curr.prev;
                    if (curr === this.head) this.head = curr.next;
                    // Break circular references to help GC
                    curr.next = curr;
                    curr.prev = curr;
                }
                this._size--;
                return true;
            }
            curr = curr.next;
        } while (curr !== this.head);

        return false;
    }

    clear(): void {
        if (this.head) {
            let curr = this.head;
            do {
                const next = curr.next;
                curr.next = curr;
                curr.prev = curr;
                curr = next;
            } while (curr !== this.head);
        }

        this.head = null;
        this._size = 0;
    }

    // Iterator implementation
    [Symbol.iterator](): Iterator<T> {
        const startNode = this.head;
        let current = this.head;
        let isFirst = true;

        return {
            next(): IteratorResult<T> {
                if (!current || (!isFirst && current === startNode)) {
                    return { done: true, value: undefined };
                }

                const value = current.value;
                current = current.next;
                isFirst = false;

                return { done: false, value };
            },
        };
    }
}

//https://chatgpt.com/share/69641fad-8b48-8010-96c7-28d4f2170114
