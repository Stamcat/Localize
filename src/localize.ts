import { FormatNumberOptions, FormatDateOptions, MessageDescriptor, PrimitiveType } from "react-intl";
import { Formats, FormatXMLElementFn, IntlMessageFormat } from "intl-messageformat";
import { createIntlFunctions } from "./intl";
import { flatten } from "flat";
import { IntlMessageFormatOptions } from "./types";
import { createLocalizeInstance } from "./storage";
import { localeMap } from "./constants";

export function createLocalize(defaultLocale = "en-US") {
    const localeInstance = createLocalizeInstance(defaultLocale);
    const { appIntl, appIntlFormatOverride } = createIntlFunctions(localeInstance);

    const instance = {
        /**
         * Returns current locale registered in memory
         */
        getLocale: () => localeInstance.getLocale(),
        /**
         * Sets to a new locale
         */
        setLocale: (newLocale: string) => {
            localeInstance.setLocale(newLocale);
        },
        /**
         * Returns the country code of the locale registered in memory
         */
        getCountryCode: () => localeInstance.getCountryCode(),
        /**
         * Returns the language code of the locale registered in memory
         */
        getLanguageCode: () => localeInstance.getLanguageCode(),
        pending: {
            get: (key: string) => localeInstance.getPending(key),
            set: (key: string, value: Promise<void>) => localeInstance.setPending(key, value),
            delete: (key: string) => localeInstance.deletePending(key),
            has: (key: string) => localeInstance.hasPending(key),
            clear: () => localeInstance.clearPending(),
        },
        /**
         * Returns all messages registered in memory
         */
        getAllMessages: (): Record<string, unknown> => localeInstance.getAllTranslations(),
        /**
         * Returns a flattened object for you to add to memory using setTranslations or appendMessages
         */
        prepareMessages: (locale: string, fetchedMessages: object, delimiter: string = "/") => {
            let flattenedMessages: Record<string, Record<string, string>> = {};

            const currentLocale = localeMap[locale];

            if (!flattenedMessages[currentLocale]) {
                const f: Record<string, string> = flatten(fetchedMessages, {
                    delimiter,
                });
                flattenedMessages = {
                    [locale]: f,
                };
            }
            return flattenedMessages[locale];
        },

        /**
         * Creates a new message set with a combination of current set and the new set passed in
         */
        appendMessages: (newMessages: Record<string, unknown>) => {
            const messages = localeInstance.getAllTranslations();
            localeInstance.setTranslations({ ...messages, ...newMessages });
        },
        /**
         * Replaces all translations in memory with the object passed in
         */
        setTranslations: (newMessages: Record<string, unknown>) => {
            localeInstance.setTranslations(newMessages);
        },
        /**
         * Changes locale and replaces messages
         */
        changeLocale: (newLocale: string, messages?: object, delimiter?: string) => {
            localeInstance.setLocale(newLocale);
            if (messages) {
                const newMessages = instance.prepareMessages(newLocale, messages, delimiter);
                localeInstance.setTranslations(newMessages);
            }
        },
        /**
         * Imperial vs Metric system formatting for a locale.
         * No locale will select locale saved in Localize memory
         * @param locale
         * @returns
         */
        getMeasureFormat: (locale?: string): "metric" | "imperial" => {
            const l = locale || instance.getLocale();
            const region = new Intl.Locale(l).region;
            const imperialRegions = ["US", "LR", "MM"];
            return imperialRegions.includes(region || "US") ? "imperial" : "metric";
        },
        /**
         * Returns the localized country name.
         * @param locale
         * @param localizedTo force return of country name in a different locale's language
         * @returns
         */
        getCountryName: (locale: string, localizedTo?: string) => {
            const parts = locale.split("-");
            const region = parts.length > 1 ? parts[1].toUpperCase() : "";
            try {
                const displayLocale =
                    Intl.DisplayNames.supportedLocalesOf([localizedTo || locale])[0] || instance.getLocale();
                const displayNames = new Intl.DisplayNames([displayLocale], {
                    type: "region",
                });
                return displayNames.of(region) || region;
            } catch {
                return region;
            }
        },
        /**
         * Returns formatted date value
         */
        formatDate: (value: Parameters<Intl.DateTimeFormat["format"]>[0] | string, opts?: FormatDateOptions) => {
            const intl = appIntlFormatOverride();
            if (!value) {
                return "";
            }
            return intl.formatDate(value, opts);
        },
        formatDateRange: (
            from: Parameters<Intl.DateTimeFormat["format"]>[0] | string,
            to: Parameters<Intl.DateTimeFormat["format"]>[0] | string,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FormatDateTimeRangeOptions is not yet cooperating with TypeScript
            opts?: any,
        ) => {
            const intl = appIntlFormatOverride();
            if (!from || !to) {
                return "";
            }
            return intl.formatDateTimeRange(from, to, opts);
        },
        /**
         * Returns formatted message value
         * @param id - This is mandatory
         * @param values - Pass in variables from your translation string, and their values { val: "hello" }
         * @param descriptor - Additional details like description & defaultMessage
         * @param opts - Additional options
         */
        formatMessage: (
            id: string,
            values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
            descriptor?: MessageDescriptor,
            opts?: IntlMessageFormatOptions,
        ): string => {
            const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV;
            if (nodeEnv === "test") {
                return id;
            }
            const intl = appIntl();
            if (!id) {
                return "";
            }
            return intl.formatMessage({ id, ...descriptor }, values, opts);
        },
        /**
         * Formats a string without an ID. Useful when you don't have IDs on app render
         */
        message: (
            message: string,
            values?: Record<string, PrimitiveType | FormatXMLElementFn<string, string>>,
            overrideFormats?: Partial<Formats>,
            opts?: IntlMessageFormatOptions,
        ) => {
            const locale = localeInstance.getLocale();
            const msg = new IntlMessageFormat(message, locale, overrideFormats, opts);
            return msg.format(values);
        },
        /**
         * Returns formatted number value
         */
        formatNumber: (value: Parameters<Intl.NumberFormat["format"]>[0], opts?: FormatNumberOptions) => {
            const intl = appIntlFormatOverride();
            return intl.formatNumber(value, opts);
        },
    };

    return instance;
}

/** Default singleton instance — preserves backward compatibility with all existing imports. */
export const Localize = createLocalize();
