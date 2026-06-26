import { cache } from "./cache";

export type LocalizeStore = {
    locale: string;
    messages: Record<string, unknown>;
    /** In-flight node fetches, so parallel layout/page renders don't duplicate work. */
    pending: Map<string, Promise<void>>;
};

export type LocalizeInstance = {
    getLocale: () => string;
    setLocale: (newLocale: string) => void;
    getAllTranslations: () => Record<string, unknown>;
    setTranslations: (newMessages: Record<string, unknown>) => void;
    getCountryCode: () => string;
    getLanguageCode: () => string;
    getPending: (key: string) => Promise<void> | undefined;
    setPending: (key: string, value: Promise<void>) => void;
    deletePending: (key: string) => void;
    hasPending: (key: string) => boolean;
    clearPending: () => void;
};

/**
 * Creates an independent localize store and its accessor object.
 * Each call returns a new isolated instance, allowing multiple locales
 * (e.g. user locale vs. fallback locale) to coexist without shared state.
 */
export function createLocalizeInstance(defaultLocale = "en-US"): LocalizeInstance {
    const storeCache = cache(
        (): LocalizeStore => ({
            locale: defaultLocale,
            messages: {},
            pending: new Map(),
        }),
    );
    const store = storeCache();

    return {
        getLocale: () => store.locale,
        setLocale: (newLocale: string) => {
            store.locale = newLocale;
        },
        getAllTranslations: (): Record<string, unknown> => store.messages,
        setTranslations: (newMessages: Record<string, unknown>) => {
            store.messages = newMessages;
        },
        getPending: (key: string) => store.pending.get(key),
        setPending: (key: string, value: Promise<void>) => {
            store.pending.set(key, value);
        },
        deletePending: (key: string) => {
            store.pending.delete(key);
        },
        hasPending: (key: string) => store.pending.has(key),
        clearPending: () => {
            store.pending.clear();
        },
        getCountryCode: (): string => {
            const parts = store.locale.split("-");
            return parts.length > 1 ? parts[1].toUpperCase() : "US";
        },
        getLanguageCode: (): string => {
            const parts = store.locale.split("-");
            return parts[0].toLowerCase();
        },
    };
}

/** Default instance — preserves backward compatibility with existing imports of `Locale`. */
export const Locale = createLocalizeInstance();
