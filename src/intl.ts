import { IntlShape, createIntl, createIntlCache } from "react-intl";
import { intlOverrideMap, localeMap } from "./constants";
import { Locale, LocalizeInstance } from "./storage";
import { flatten } from "flat";

export type IntlFunctions = {
    appIntl: () => IntlShape;
    overrideAppIntl: () => IntlShape;
    appIntlFormatOverride: () => IntlShape;
};

let flattenedMessages: Record<string, Record<string, string>> = {};

const getMessages = (locale: string, delimiter: string = "/", getAllTranslations?: () => Record<string, unknown>) => {
    if (getAllTranslations) {
        // Instance-specific path — bypass shared cache to avoid cross-instance contamination
        const f: Record<string, string> = flatten(getAllTranslations(), { delimiter });
        return f;
    }
    const currentLocale = localeMap[locale];

    if (!flattenedMessages[currentLocale]) {
        const allMessages = Locale.getAllTranslations();
        const fetchedMessages = allMessages;
        const f: Record<string, string> = flatten(fetchedMessages, {
            delimiter,
        });
        flattenedMessages = {
            [locale]: f,
        };
    }
    return flattenedMessages[locale];
};

export function createIntlFunctions(localeInstance: LocalizeInstance): IntlFunctions {
    let intl: IntlShape;
    let intlOverride: IntlShape;

    const appIntl = () => {
        const l = localeInstance.getLocale();
        if (!intl || intl.locale !== l) {
            const m = getMessages(l, "/", localeInstance.getAllTranslations);
            intl = createIntl(
                {
                    locale: l,
                    messages: m,
                },
                createIntlCache(),
            );
        }
        return intl;
    };

    const overrideAppIntl = () => {
        if (!intlOverride) {
            const l = localeInstance.getLocale();
            intlOverride = createIntl(
                {
                    locale: intlOverrideMap[l] || `${l}-u-nu-latn`,
                },
                createIntlCache(),
            );
        }
        return intlOverride;
    };

    const appIntlFormatOverride = () => {
        const l = localeInstance.getLocale();
        return intlOverrideMap[l] ? overrideAppIntl() : appIntl();
    };

    return { appIntl, overrideAppIntl, appIntlFormatOverride };
}

// Backward-compatible singleton exports — existing imports of appIntl etc. keep working
const _singletonIntl = createIntlFunctions(Locale);
export const appIntl = _singletonIntl.appIntl;
export const overrideAppIntl = _singletonIntl.overrideAppIntl;
export const appIntlFormatOverride = _singletonIntl.appIntlFormatOverride;
