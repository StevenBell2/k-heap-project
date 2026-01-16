# heap class that can support up to k children for each parent node
# standard heap functions including push, pop, peek, pushpop, replace
# heapify to turn a standard list into a heap
class KHeap:
    def __init__(self, k=2, *, mode="min", data=None):
        _validate_k(k)
        if mode not in ("min", "max"):
            raise ValueError("mode must be 'min' or 'max'")
        self.k = k
        self.mode = mode
        self._a = [] if data is None else list(data)
        if self._a:
            self.heapify()

    def __len__(self):
        return len(self._a)
    
    def is_empty(self):
        return len(self._a) == 0
    
    def peek(self):
        if not self._a:
            raise IndexError("heap is empty")
        return self._a[0]
    
    # this will add an element to the heap and then move it to the correct position
    def push(self, x):
        self._a.append(x)
        self._sift_up(len(self._a) - 1)

    # this will remove the root element
    def pop(self):
        if not self._a:
            raise IndexError("heap is empty")
        root = self._a[0]
        last = self._a.pop()
        if self._a:
            self._a[0] = last
            self._sift_down(0)
        return root

    def pushpop(self, x):
        if not self._a:
            return x
        
        root = self._a[0]

        if self._better(root, x):
            self._a[0] = x
            self._sift_down(0)
            return root
        
        return x 
    
    def replace(self, x):
        if not self._a:
            raise IndexError("heap is empty")
        root = self._a[0]
        self._a[0] = x
        self._sift_down(0)
        return root
    
    #this will turn a list into a heap with up to k children for each node
    def heapify(self):
        n = len(self._a)
        for i in range((n - 2) // self.k, -1, -1):
            self._sift_down(i)

    def _better(self, a, b):
        #will return true if a should be above b
        return a < b if self.mode == "min" else a > b
    
    def _sift_up(self, idx):
        global comparison_count
        newitem = self._a[idx]
        while idx > 0:
            parent = (idx - 1) // self.k
            comparison_count += 1
            if not self._better(newitem, self._a[parent]):
                break
            self._a[idx] = self._a[parent]
            idx = parent
        self._a[idx] = newitem

    def _sift_down(self, idx):
        global comparison_count
        n = len(self._a)
        newitem = self._a[idx]

        while True:
            first_child = self.k * idx + 1
            if first_child >= n:
                break

            best = first_child
            last = min(first_child + self.k, n)
            for c in range(first_child + 1, last):
                comparison_count += 1
                if self._better(self._a[c], self._a[best]):
                    best = c

            comparison_count += 1
            if self._better(newitem, self._a[best]) or newitem == self._a[best]:
                break

            self._a[idx] = self._a[best]
            idx = best
        
        self._a[idx] = newitem

def _validate_k(k):
    if k < 2:
        raise ValueError("k must be greater or equal to 2")

comparison_count = 0

def reset_counter():
    global comparison_count
    comparison_count = 0

def get_comparison_count():
    return comparison_count
