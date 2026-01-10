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
        const degreeArray = new Array<Node | undefined>(
            Math.floor(Math.log2(this.size)) + 2,
        );
        const minNode = this.min;
        if (!this.min) return null;
        for (let node of this.min?.children) {
            node.parent = null;
            this.rootTree.append(node);
        }
        this.rootTree.remove(this.min);
        this.size--;
        const tempSpace = this.rootTree.toArray();
        this.rootTree.clear();
        for (let currentNode of tempSpace) {
            let nodeAlreadyThere = degreeArray[currentNode.degree];
            while (nodeAlreadyThere) {
                let parentNode;
                let childNode;
                if (nodeAlreadyThere.value < currentNode.value) {
                    parentNode = nodeAlreadyThere;
                    childNode = currentNode;
                } else {
                    parentNode = currentNode;
                    childNode = nodeAlreadyThere;
                }
                parentNode.children.append(childNode);
                parentNode.degree++;
                childNode.parent = parentNode;
                degreeArray[currentNode.degree] = undefined;
                currentNode = parentNode;
                nodeAlreadyThere = degreeArray[currentNode.degree];
            }
            if (!nodeAlreadyThere) {
                degreeArray[currentNode.degree] = currentNode;
            }
        }
        let tempMinNode: Node | null = null;
        for (let node of degreeArray) {
            if (node !== undefined) {
                this.rootTree.append(node);
                if (!tempMinNode || node.value < tempMinNode.value) {
                    tempMinNode = node;
                }
            }
        }
        this.min = tempMinNode;
        return minNode?.value ?? null;
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
