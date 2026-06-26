import { Decorator } from "@storybook/react";
import React from "react";
import deDeTranslations from "../../src/i18n/de-DE.json";
import enGbTranslations from "../../src/i18n/en-GB.json";
import esUsTranslations from "../../src/i18n/es-US.json";

import { Localize } from "../../src/localize";

type SupportedLocale =
 // North America
    "en-US"|
    "es-US"|
    "es-MX"|
    "fr-CA"|
    // South America
    "pt-BR"|
    "es-AR"|
    "es-CO"|
    // Europe
    "en-GB"|
    "fr-FR"|
    "fr-BE"|
    "nl-NL"|
    "de-DE"|
    "de-AT"|
    "de-CH"|
    "fr-CH"|
    "pl-PL"|
    "tr-TR"|
    // Africa
    "ar-EG"|
    "en-ZA"|
    "sw-KE"|
    // Asia
    "hi-IN"|
    "ja-JP"|
    "ko-KR"|
    // Oceania
    "en-AU"|
    "en-NZ"|
    "fr-PF"|
    // Antarctica
    "en-AQ";

const localeBundles: Record<SupportedLocale, Record<string, Record<string, unknown>>> = {
    "de-DE": deDeTranslations,
    "en-GB": enGbTranslations,
    "es-US": esUsTranslations,
    "en-US": enGbTranslations,
    "es-MX": esUsTranslations,
    "fr-CA": {},
    "pt-BR": {},
    "es-AR": esUsTranslations,
    "es-CO": esUsTranslations,
    "fr-FR": {},
    "fr-BE": {},
    "nl-NL": {},
    "de-AT": {},
    "de-CH": {},
    "fr-CH": {},
    "pl-PL": {},
    "tr-TR": {},
    "ar-EG": {},
    "en-ZA": enGbTranslations,
    "sw-KE": {},
    "hi-IN": {},
    "ja-JP": {},
    "ko-KR": {},
    "en-AU": {},
    "en-NZ": {},
    "fr-PF": {},
    "en-AQ": enGbTranslations
};

export const applyLocale = (locale: SupportedLocale) => {
    Localize.setLocale(locale);

    const bundle = localeBundles[locale];
    const localePayload = bundle[locale] ?? bundle[Object.keys(bundle)[0]] ?? {};

    // Story IDs use slash-delimited keys (e.g. report-header/report-title).
    // Force slash flattening so lookup keys match formatMessage IDs.
    const messages: Record<string, string> = Localize.prepareMessages(locale, localePayload, "/");
    Localize.setTranslations(messages);
};

export const LocaleDecorator: Decorator = (Story, context) => {
    const disableLocaleDecorator = Boolean(
        (context.parameters as { disableLocaleDecorator?: boolean }).disableLocaleDecorator,
    );

    if (disableLocaleDecorator) {
        return React.createElement(Story);
    }

    const [locale, setLocale] = React.useState<SupportedLocale>("en-GB");

    React.useLayoutEffect(() => {
        setLocale("en-GB");
        applyLocale("en-GB");
    }, [context.id]);

    const onLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = event.target.value as SupportedLocale;
        setLocale(nextLocale);
        applyLocale(nextLocale);
    };

    return  <>
        <div style={{ display: "grid", gap: "12px", marginBottom: "12px" }}>
            <label htmlFor="storybook-locale" style={{display: "inline-flex", gap: "8px", alignItems: "center"}}>Locale: <select value={locale} onChange={onLocaleChange}>
                {Object.keys(localeBundles).map((opt) => {
                    return <option value={opt} key={opt}>{opt}</option>
                })}
            </select>
            </label>
        </div>
        <Story />
    </>
   
};
