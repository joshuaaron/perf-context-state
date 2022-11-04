import React, {
    useRef,
    createContext,
    useContext,
    // useSyncExternalStore,
    useState,
    useEffect,
} from 'react';

type SetInternal<T> = {
    (partial: T | Partial<T> | ((state: T) => T | Partial<T>)): void;
};

export function createStore<State>(initialState: State) {
    function useStoreData() {
        const state = useRef<State>(initialState);
        const subscribers = useRef(new Set<(state: State) => void>());

        const get = () => state.current;

        const set: SetInternal<State> = (partial) => {
            const nextState =
                typeof partial === 'function' ? (partial as (state: State) => State)(state.current) : partial;

            if (!Object.is(nextState, state.current)) {
                // const previousState = store.current
                state.current = Object.assign({}, state.current, nextState);
                subscribers.current.forEach((subscriber) => {
                    subscriber(state.current);
                });
            }
        };

        const subscribe = (callback: (state: State) => void) => {
            subscribers.current.add(callback);
            return () => {
                subscribers.current.delete(callback);
            };
        };

        return {
            get,
            set,
            subscribe,
        };
    }

    const StoreContext = createContext<ReturnType<typeof useStoreData> | null>(null);

    function Provider({ children }: { children: React.ReactNode }) {
        return <StoreContext.Provider value={useStoreData()}>{children}</StoreContext.Provider>;
    }

    function useStore(): [State, SetInternal<State>];
    function useStore<U>(selector: (state: State) => U): [U, SetInternal<State>];
    function useStore<SelectorOutput>(selector?: (store: State) => SelectorOutput) {
        const store = useContext(StoreContext);
        if (!store) {
            throw new Error('Store not found');
        }

        // const state = useSyncExternalStore(store.subscribe, () =>
        //   selector(store.get())
        // );

        const _state = selector ? selector(store.get()) : store.get();
        const [state, setState] = useState(_state);
        useEffect(() => {
            return store.subscribe((value) => setState(selector ? selector(value) : value));
        }, [store]);

        return [state, store.set];
    }

    return {
        Provider,
        useStore,
    };
}

/**
 * Problem 1: Add support to initialize store with props (through the provider)
 * Problem 2: Add option to not pass a selector and receive the whole store
 * Problem 3: Add support for equality fn checks for non primitive values?
 */
