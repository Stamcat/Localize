/**
 * Request-scoped memoization, equivalent to React's `cache()` without a React dependency.
 *
 * - In Node.js environments, uses AsyncLocalStorage so each async context (request)
 *   gets its own isolated cache — the same semantics React provides per render tree.
 * - In browser / environments without async_hooks, falls back to module-level memoization.
 *
 * Usage mirrors React's cache() exactly:
 *
 *   const getStore = cache(() => ({ messages: {}, pending: new Map() }));
 *   getStore() === getStore(); // true within the same request context
 *
 * To create a fresh cache scope on the server (e.g. per incoming request):
 *
 *   import { runWithCache } from './cache';
 *   runWithCache(() => handleRequest(req, res));
 */

type CacheEntry<T> = { status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown };

type CacheNode = {
    entry?: CacheEntry<unknown>;
    children: Map<unknown, CacheNode>;
};

// Root of the trie is keyed by the wrapped function reference so that
// multiple cache()-wrapped functions share one storage map per context.
type ContextStore = Map<object, CacheNode>;

// ---------------------------------------------------------------------------
// AsyncLocalStorage bootstrap — Node.js only, safe to tree-shake in browsers
// ---------------------------------------------------------------------------

type ALS = {
    getStore(): ContextStore | undefined;
    run<T>(store: ContextStore, fn: () => T): T;
};

let als: ALS | null = null;

try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamic require needed for optional Node.js built-in (browser environments lack async_hooks)
    const { AsyncLocalStorage } = require("async_hooks") as typeof import("async_hooks");
    als = new AsyncLocalStorage<ContextStore>();
} catch {
    // Browser or environment without async_hooks — global fallback will be used.
}

/** Module-level fallback for browser environments or code running outside runWithCache. */
const globalStore: ContextStore = new Map();

function getCurrentStore(): ContextStore {
    return als?.getStore() ?? globalStore;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Runs `fn` inside a fresh, isolated cache context.
 *
 * All `cache()`-wrapped functions invoked synchronously or asynchronously
 * within `fn` will share a single cache that is discarded when `fn` resolves.
 * This mirrors how React automatically scopes the cache to each render tree.
 *
 * In browser environments this is a passthrough (no scoping is possible).
 */
export function runWithCache<T>(fn: () => T): T {
    if (als) {
        return als.run(new Map(), fn);
    }
    return fn();
}

/**
 * Wraps `fn` so that repeated calls with the same arguments (by reference)
 * return the cached result for the lifetime of the current cache context.
 *
 * Arguments are compared with strict identity (===), matching React's semantics.
 * The cache trie is walked per-argument, so partial-application sharing is
 * handled correctly even across calls with different argument counts.
 */
export function cache<TArgs extends unknown[], TReturn>(fn: (...args: TArgs) => TReturn): (...args: TArgs) => TReturn {
    return (...args: TArgs): TReturn => {
        const store = getCurrentStore();

        // Each wrapped function gets its own root node in the store,
        // keyed by function reference (functions are objects — valid Map keys).
        let node = store.get(fn);
        if (!node) {
            node = { children: new Map() };
            store.set(fn, node);
        }

        // Walk (and lazily create) the argument trie.
        // Use a separate variable to avoid TypeScript losing narrowing across loop iterations.
        let current: CacheNode = node;
        for (const arg of args) {
            let child: CacheNode | undefined = current.children.get(arg);
            if (!child) {
                child = { children: new Map() };
                current.children.set(arg, child);
            }
            current = child;
        }

        // Return or populate the cached entry for this argument path.
        if (current.entry) {
            if (current.entry.status === "fulfilled") {
                return current.entry.value as TReturn;
            }
            throw current.entry.reason;
        }

        try {
            const value = fn(...args);
            current.entry = { status: "fulfilled", value };
            return value;
        } catch (reason) {
            current.entry = { status: "rejected", reason };
            throw reason;
        }
    };
}
