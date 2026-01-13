import CircularDoublyLinkedList from "./utils/CircularDoublyLinkedList";
class Node {
    degree: number = 0;
    marked: boolean = false;
    children: CircularDoublyLinkedList<Node> = new CircularDoublyLinkedList();
    value: number;
    constructor(value: number) {
        this.value = value;
    }
    parent: Node | null = null;
}

class FibonacciHeap {
    rootTree = new CircularDoublyLinkedList<Node>();
    min: Node | null = null;
    maxDegree = 0;
    size = 0;

    insert(value: number) {
        const newNode = new Node(value);
        this.rootTree.append(newNode);
        this.size++;
        if (!this.min || value < this.min.value) {
            this.min = newNode;
        }
    }

    extractMin(): number | null {
        if (!this.min) return null;

        const minNode = this.min;
        const degreeArray = new Array<Node | undefined>(
            Math.floor(Math.log2(this.size)) + 2,
        );
        const childrenArray = minNode.children.toArray();
        for (let node of childrenArray) {
            node.parent = null;
            node.marked = false;
            this.rootTree.append(node);
        }

        this.rootTree.remove(minNode);
        this.size--;

        if (this.size === 0) {
            this.min = null;
            return minNode.value;
        }

        const tempSpace = this.rootTree.toArray();
        this.rootTree.clear();

        for (let currentNode of tempSpace) {
            let degree = currentNode.degree;
            let nodeAlreadyThere = degreeArray[degree];

            while (nodeAlreadyThere !== undefined) {
                let parentNode: Node;
                let childNode: Node;

                if (nodeAlreadyThere.value < currentNode.value) {
                    parentNode = nodeAlreadyThere;
                    childNode = currentNode;
                } else {
                    parentNode = currentNode;
                    childNode = nodeAlreadyThere;
                }

                parentNode.children.append(childNode);
                childNode.parent = parentNode;
                childNode.marked = false;
                parentNode.degree++;

                degreeArray[degree] = undefined;
                degree++;
                currentNode = parentNode;
                nodeAlreadyThere = degreeArray[degree];
            }

            degreeArray[degree] = currentNode;
        }

        let newMin: Node | null = null;
        for (let node of degreeArray) {
            if (node !== undefined) {
                node.parent = null;
                this.rootTree.append(node);
                if (newMin === null || node.value < newMin.value) {
                    newMin = node;
                }
            }
        }

        this.min = newMin;
        return minNode.value;
    }

    getMin(): number | null {
        return this.min?.value ?? null;
    }
    decreaseKey(node: Node, newValue: number) {
        if (newValue > node.value) {
            throw new Error("New value is greater than current value");
        }

        node.value = newValue;
        const parentNode = node.parent;
        if (parentNode && node.value < parentNode.value) {
            parentNode.children.remove(node);
            parentNode.degree--;
            this.rootTree.append(node);
            node.parent = null;
            node.marked = false;

            let currentParent = parentNode;
            while (currentParent) {
                if (!currentParent.marked) {
                    currentParent.marked = true;
                    break;
                } else {
                    const grandParent = currentParent.parent;
                    if (grandParent) {
                        grandParent.children.remove(currentParent);
                        grandParent.degree--;
                        this.rootTree.append(currentParent);
                        currentParent.parent = null;
                        currentParent.marked = false;
                        currentParent = grandParent;
                    } else {
                        break;
                    }
                }
            }
        }
        if (!this.min || node.value < this.min.value) {
            this.min = node;
        }
    }
}

export default FibonacciHeap;
