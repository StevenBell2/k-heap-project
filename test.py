import random
import matplotlib.pyplot as plt
import numpy as np
from heap import KHeap, reset_counter, get_comparison_count

def _avg_trials(trials, fn):
    samples = []
    for _ in range(trials):
        reset_counter()
        fn()
        samples.append(get_comparison_count())
    return float(np.mean(samples)), float(np.std(samples))


def test_push_complexity(trials=20):
    sizes = [100, 500, 1000, 2500, 5000, 7500, 10000]
    comparisons = []
    stds = []

    for n in sizes:
        def run():
            heap = KHeap(k=4)
            for _ in range(n):
                heap.push(random.randint(0, n))
        avg, sd = _avg_trials(trials, run)
        comparisons.append(avg)
        stds.append(sd)

    return sizes, comparisons, stds, "Push (n insertions, avg)", "O(n log_k n)"


def test_pop_complexity(trials=20):
    """n pops should be O(n k log_k n) for k-heap"""
    sizes = [100, 500, 1000, 2500, 5000, 7500, 10000]
    comparisons = []
    stds = []

    k = 4
    for n in sizes:
        def run():
            heap = KHeap(k=k, data=list(range(n)))
            for _ in range(n):
                heap.pop()
        avg, sd = _avg_trials(trials, run)
        comparisons.append(avg)
        stds.append(sd)

    return sizes, comparisons, stds, f"Pop (n extractions, k={k}, avg)", f"O(n k log_k n)"


def test_heapify_complexity(trials=20):
    """Heapify is O(n)"""
    sizes = [100, 500, 1000, 2500, 5000, 7500, 10000]
    comparisons = []
    stds = []

    for n in sizes:
        def run():
            data = [random.randint(0, n) for _ in range(n)]
            KHeap(k=2, data=data)
        avg, sd = _avg_trials(trials, run)
        comparisons.append(avg)
        stds.append(sd)

    return sizes, comparisons, stds, "Heapify (avg)", "O(n)"


def test_replace_complexity(trials=20):
    """replace is O(k log_k n) per operation, n operations total"""
    sizes = [100, 500, 1000, 2500, 5000, 7500, 10000]
    comparisons = []
    stds = []

    k = 4
    for n in sizes:
        def run():
            heap = KHeap(k=k, data=list(range(n)))
            for _ in range(n):
                heap.replace(random.randint(0, n))
        avg, sd = _avg_trials(trials, run)
        comparisons.append(avg)
        stds.append(sd)

    return sizes, comparisons, stds, f"Replace (n ops, k={k}, avg)", f"O(n k log_k n)"


def test_pushpop_complexity(trials=20):
    """pushpop is O(1) best case, O(k log_k n) worst case"""
    sizes = [100, 500, 1000, 2500, 5000, 7500, 10000]
    best_case = []
    best_stds = []
    worst_case = []
    worst_stds = []

    k = 4
    ops = 100
    for n in sizes:
        def run_best():
            heap = KHeap(k=k, data=list(range(1, n + 1)))
            reset_counter()  # exclude heapify cost
            for _ in range(ops):
                heap.pushpop(0)
        avg, sd = _avg_trials(trials, run_best)
        best_case.append(avg)
        best_stds.append(sd)

        def run_worst():
            heap = KHeap(k=k, data=list(range(n)))
            reset_counter()  
            for _ in range(ops):
                heap.pushpop(n + 1000)
        avg, sd = _avg_trials(trials, run_worst)
        worst_case.append(avg)
        worst_stds.append(sd)

    return sizes, best_case, best_stds, worst_case, worst_stds, ops


def test_k_value_impact(trials=20):
    """Compare different k values"""
    n = 5000
    k_values = [2, 3, 4, 5, 8, 10]
    push_comps = []
    pop_comps = []

    for k in k_values:
        def run_push():
            heap = KHeap(k=k)
            for _ in range(n):
                heap.push(random.randint(0, n))
        avg, _ = _avg_trials(trials, run_push)
        push_comps.append(avg)

        def run_pop():
            heap = KHeap(k=k, data=list(range(n)))
            for _ in range(n):
                heap.pop()
        avg, _ = _avg_trials(trials, run_pop)
        pop_comps.append(avg)

    return k_values, push_comps, pop_comps


def plot_results(trials=20):
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))

    # Plot push complexity
    sizes, comps, stds, title, expected = test_push_complexity(trials=trials)
    axes[0, 0].errorbar(sizes, comps, yerr=stds, fmt='bo-', label='Measured (avg)')
    theoretical = [n * np.log2(n) for n in sizes]
    scale = comps[-1] / theoretical[-1]
    axes[0, 0].plot(sizes, [t * scale for t in theoretical], 'r--', label=expected)
    axes[0, 0].set_xlabel('n')
    axes[0, 0].set_ylabel('Comparisons')
    axes[0, 0].set_title(title)
    axes[0, 0].legend()
    axes[0, 0].grid(True, alpha=0.3)

    # Plot pop complexity
    sizes, comps, stds, title, expected = test_pop_complexity(trials=trials)
    axes[0, 1].errorbar(sizes, comps, yerr=stds, fmt='bo-', label='Measured (avg)')
    theoretical = [n * 4 * (np.log(n) / np.log(4)) for n in sizes]
    scale = comps[-1] / theoretical[-1]
    axes[0, 1].plot(sizes, [t * scale for t in theoretical], 'r--', label=expected)
    axes[0, 1].set_xlabel('n')
    axes[0, 1].set_ylabel('Comparisons')
    axes[0, 1].set_title(title)
    axes[0, 1].legend()
    axes[0, 1].grid(True, alpha=0.3)

    # Plot heapify complexity
    sizes, comps, stds, title, expected = test_heapify_complexity(trials=trials)
    axes[0, 2].errorbar(sizes, comps, yerr=stds, fmt='bo-', label='Measured (avg)')
    scale = comps[-1] / sizes[-1]
    axes[0, 2].plot(sizes, [n * scale for n in sizes], 'r--', label=expected)
    axes[0, 2].set_xlabel('n')
    axes[0, 2].set_ylabel('Comparisons')
    axes[0, 2].set_title(title)
    axes[0, 2].legend()
    axes[0, 2].grid(True, alpha=0.3)

    # Plot replace complexity
    sizes, comps, stds, title, expected = test_replace_complexity(trials=trials)
    axes[1, 0].errorbar(sizes, comps, yerr=stds, fmt='bo-', label='Measured (avg)')
    theoretical = [n * 4 * (np.log(n) / np.log(4)) for n in sizes]
    scale = comps[-1] / theoretical[-1]
    axes[1, 0].plot(sizes, [t * scale for t in theoretical], 'r--', label=expected)
    axes[1, 0].set_xlabel('n')
    axes[1, 0].set_ylabel('Comparisons')
    axes[1, 0].set_title(title)
    axes[1, 0].legend()
    axes[1, 0].grid(True, alpha=0.3)

    # Plot pushpop complexity
    sizes, best, best_std, worst, worst_std, ops = test_pushpop_complexity(trials=trials)
    axes[1, 1].errorbar(sizes, best, yerr=best_std, fmt='go-', label='Best case (avg)')
    axes[1, 1].errorbar(sizes, worst, yerr=worst_std, fmt='ro-', label='Worst case (avg)')
    theoretical = [ops * 4 * (np.log(n) / np.log(4)) for n in sizes]
    scale = worst[-1] / theoretical[-1]
    axes[1, 1].plot(sizes, [t * scale for t in theoretical], 'r--', alpha=0.5, label='O(k log_k n)')
    axes[1, 1].set_xlabel('n')
    axes[1, 1].set_ylabel('Comparisons')
    axes[1, 1].set_title(f'Pushpop ({ops} ops, k=4)')
    axes[1, 1].legend()
    axes[1, 1].grid(True, alpha=0.3)

    # Summary text
    axes[1, 2].axis('off')
    summary = """K-Heap Runtime Complexity
==========================

push():    O(log_k n)
pop():     O(k log_k n)
peek():    O(1)
heapify(): O(n)
pushpop(): O(1) to O(k log_k n)
replace(): O(k log_k n)

Trade-off:
----------
• Higher k -> fewer levels
  -> faster push
• Higher k -> more children
  -> slower pop

Note: log_k(n) = log(n)/log(k)
"""
    axes[1, 2].text(0.05, 0.5, summary, fontsize=10, family='monospace',
                     verticalalignment='center', wrap=True)

    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    plot_results(trials=20)