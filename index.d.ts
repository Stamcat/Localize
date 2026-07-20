import type { FormatDateOptions, FormatNumberOptions, MessageDescriptor, PrimitiveType } from "react-intl";
import type { FormatXMLElementFn, Formats, Options as IntlMessageFormatOptions } from "intl-messageformat";

export type IntlProviderMode = "client" | "server";

export type LocalizeMessageValues = Record<string, PrimitiveType | FormatXMLElementFn<string, string>>;

export interface LocalizePendingStore {
    get: (key: string) => Promise<void> | undefined;
    set: (key: string, value: Promise<void>) => void;
    delete: (key: string) => void;
    has: (key: string) => boolean;
    clear: () => void;
}

export interface LocalizeInstance {
    getLocale: () => string;
    setLocale: (newLocale: string) => void;
    getCountryCode: () => string;
    getLanguageCode: () => string;
    pending: LocalizePendingStore;
    getAllMessages: () => Record<string, unknown>;
    prepareMessages: (locale: string, fetchedMessages: object, delimiter?: string) => Record<string, string>;
    appendMessages: (newMessages: Record<string, unknown>) => void;
    setTranslations: (newMessages: Record<string, unknown>) => void;
    changeLocale: (newLocale: string, messages?: object, delimiter?: string) => void;
    getMeasureFormat: (locale?: string) => "metric" | "imperial";
    getCountryName: (locale: string, localizedTo?: string) => string;
    formatDate: (value: string | number | Date, opts?: FormatDateOptions) => string;
    formatDateRange: (from: string | number | Date, to: string | number | Date, opts?: unknown) => string;
    formatMessage: (
        id: string,
        values?: LocalizeMessageValues,
        descriptor?: MessageDescriptor,
        opts?: IntlMessageFormatOptions,
    ) => string;
    message: (
        message: string,
        values?: LocalizeMessageValues,
        overrideFormats?: Partial<Formats>,
        opts?: IntlMessageFormatOptions,
    ) => unknown;
    formatNumber: (value: number, opts?: FormatNumberOptions) => string;
}

export declare function createLocalize(provider?: IntlProviderMode, defaultLocale?: string): LocalizeInstance;

declare const Localize: LocalizeInstance;
export default Localize;
