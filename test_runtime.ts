import FibonacciHeap from "./fibonacciHeap";

function measureTime(fn: () => void): number {
    const start = performance.now();
    fn();
    const end = performance.now();
    return end - start;
}

console.log("=== Fibonacci Heap Runtime Tests ===\n");

// Test 1: Insert - O(1)
console.log("1. INSERT - O(1) amortized");
const heap1 = new FibonacciHeap();
const insertTime = measureTime(() => {
    for (let i = 0; i < 10000; i++) {
        heap1.insert(Math.floor(Math.random() * 10000));
    }
});
console.log(`   10,000 inserts: ${insertTime.toFixed(2)}ms`);
console.log(`   Avg per insert: ${(insertTime / 10000).toFixed(4)}ms\n`);

// Test 2: Get Min - O(1)
console.log("2. GET MIN - O(1)");
const heap2 = new FibonacciHeap();
for (let i = 1000; i >= 1; i--) heap2.insert(i);
const getMinTime = measureTime(() => {
    for (let i = 0; i < 100000; i++) {
        heap2.getMin();
    }
});
console.log(`   100,000 getMin calls: ${getMinTime.toFixed(2)}ms`);
console.log(`   Avg per call: ${(getMinTime / 100000).toFixed(6)}ms\n`);

// Test 3: Extract Min - O(log n) amortized
console.log("3. EXTRACT MIN - O(log n) amortized");
const heap3 = new FibonacciHeap();
for (let i = 0; i < 5000; i++) {
    heap3.insert(Math.floor(Math.random() * 5000));
}
const extractTime = measureTime(() => {
    for (let i = 0; i < 1000; i++) {
        heap3.extractMin();
    }
});
console.log(`   1,000 extractMin: ${extractTime.toFixed(2)}ms`);
console.log(`   Avg per extract: ${(extractTime / 1000).toFixed(4)}ms\n`);

// Test 4: Decrease Key - O(1) amortized
console.log("4. DECREASE KEY - O(1) amortized");
const heap4 = new FibonacciHeap();
const nodes: any[] = [];
for (let i = 0; i < 1000; i++) {
    heap4.insert(i * 10);
}
// Extract min a few times to create structure
for (let i = 0; i < 100; i++) {
    heap4.extractMin();
}
// Get reference to root nodes for decrease key
const rootNodes = heap4.rootTree.toArray();
const decreaseTime = measureTime(() => {
    rootNodes.forEach((node, idx) => {
        if (idx < 100) {
            heap4.decreaseKey(node, node.value - 5);
        }
    });
});
console.log(`   100 decreaseKey ops: ${decreaseTime.toFixed(2)}ms`);
console.log(`   Avg per decrease: ${(decreaseTime / 100).toFixed(4)}ms\n`);

// Test 5: Mixed operations
console.log("5. MIXED OPERATIONS");
const heap5 = new FibonacciHeap();
const mixedTime = measureTime(() => {
    for (let i = 0; i < 1000; i++) {
        heap5.insert(Math.floor(Math.random() * 1000));
        if (i % 10 === 0) heap5.extractMin();
        if (i % 5 === 0) heap5.getMin();
    }
});
console.log(`   1000 inserts + 100 extracts + 200 getMins: ${mixedTime.toFixed(2)}ms\n`);

console.log("=== Summary ===");
console.log("Insert:       O(1) amortized");
console.log("Get Min:      O(1)");
console.log("Extract Min:  O(log n) amortized");
console.log("Decrease Key: O(1) amortized");
