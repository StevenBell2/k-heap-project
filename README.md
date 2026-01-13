# Fibonacci Heap Implementation

A TypeScript implementation of a Fibonacci Heap data structure with efficient amortized time complexities.

## Operations & Time Complexity

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| `insert(value)` | O(1) amortized | Insert a new value into the heap |
| `getMin()` | O(1) | Get the minimum value without removing it |
| `extractMin()` | O(log n) amortized | Remove and return the minimum value |
| `decreaseKey(node, newValue)` | O(1) amortized | Decrease the value of a given node |

## Runtime Test Results

### Test 1: INSERT - O(1) amortized
- 10,000 inserts: **3.43ms**
- Average per insert: **0.0003ms**

### Test 2: GET MIN - O(1)
- 100,000 getMin calls: **0.61ms**
- Average per call: **0.000006ms**

### Test 3: EXTRACT MIN - O(log n) amortized
- 1,000 extractMin operations: **10.91ms**
- Average per extract: **0.0109ms**

### Test 4: DECREASE KEY - O(1) amortized
- 100 decreaseKey operations: **0.13ms**
- Average per decrease: **0.0013ms**

### Test 5: MIXED OPERATIONS
- 1,000 inserts + 100 extracts + 200 getMins: **1.61ms**

## Usage

```typescript
import FibonacciHeap from "./fibonacciHeap";

const heap = new FibonacciHeap();

// Insert values
heap.insert(10);
heap.insert(5);
heap.insert(20);

// Get minimum
console.log(heap.getMin()); // 5

// Extract minimum
console.log(heap.extractMin()); // 5
console.log(heap.getMin()); // 10
```

## Running Tests

```bash
npx tsx test_runtime.ts
```

## Structure

- `fibonacciHeap.ts` - Main Fibonacci Heap implementation
- `utils/CircularDoublyLinkedList.ts` - Helper data structure for managing heap nodes
- `test_runtime.ts` - Performance benchmarks

## To run the program locally
1. Clone the repository
2. You need Node.js installed on your machine. 
3. If you have typescript installed globally, run: `tsc fibonacciHeap.ts test_runtime.ts utils/CircularDoublyLinkedList.ts` to get the JavaScript files. Then run `node fibonacciHeap.js`
4. If you don't have typescript installed globally, run: `npx tsx fibonacciHeap.ts`

## References 
- Double Linked List implementation from AI (used since this is a utility class and the main implementation is the fibonacci heap) - https://chatgpt.com/share/69641fad-8b48-8010-96c7-28d4f2170114
- Fibonacci Heap concept - https://www.youtube.com/watch?v=6JxvKfSV9Ns
