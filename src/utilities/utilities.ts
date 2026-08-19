import { CONVERSION_TABLE, IMPERIAL_REGIONS, MASS_CONVERSION_TABLE } from "./constants";
import { MeasureFormat, LengthUnit, MassUnit } from "./types";
import countryToCurrency from "country-to-currency";

const DEFAULT_CURRENCY = "USD";

export const getMeasureFormat = (locale: string): MeasureFormat => {
    const region = new Intl.Locale(locale).region;
    return IMPERIAL_REGIONS.includes((region ?? "US") as (typeof IMPERIAL_REGIONS)[number]) ? "imperial" : "metric";
};

export const convertLength = (value: string | number | null, from: LengthUnit, to: LengthUnit): number | null => {
    if (value === null) {
        return null;
    }
    const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
    if (!Number.isFinite(numeric)) {
        return null;
    }

    // Resolve compound ft-in to decimal feet for the purpose of conversion.
    const resolvedFrom = from === "ft-in" ? "ft" : from;
    const resolvedTo = to === "ft-in" ? "ft" : to;

    const fromFactor = CONVERSION_TABLE[resolvedFrom];
    const toFactor = CONVERSION_TABLE[resolvedTo];

    const meters = numeric * fromFactor;
    return meters / toFactor;
};

export const convertWeight = (value: string | number | null, from: MassUnit, to: MassUnit): number | null => {
    if (value === null) {
        return null;
    }

    const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
    if (!Number.isFinite(numeric)) {
        return null;
    }

    const fromFactor = MASS_CONVERSION_TABLE[from];
    const toFactor = MASS_CONVERSION_TABLE[to];

    const kilograms = numeric * fromFactor;
    return kilograms / toFactor;
};
/**
 * There are over 2,000 ways that this function can return a useful value. Check the storybook for usage guidelines.
 * @param unit
 * @param locale
 * @param quantity
 * @returns
 */
export const getUnitLabel = (
    unit: Intl.NumberFormatOptions["unit"],
    locale: Intl.LocalesArgument,
    quantity = 1,
): string =>
    new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "long" })
        .formatToParts(quantity)
        .find((p) => p.type === "unit")?.value ?? String(unit);

export const is24HourFormat = (locale: Intl.LocalesArgument) => {
    const options = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions();
    return options.hourCycle === "h23" || options.hourCycle === "h24";
};

export const getCurrencyByLocale = (locale?: string): string => {
    if (!locale) {
        return DEFAULT_CURRENCY;
    }

    const extensionCurrency = locale.match(/-u(?:-[a-z0-9]{2,8})*-cu-([a-z]{3})(?:-|$)/i)?.[1]?.toUpperCase();
    if (extensionCurrency) {
        return extensionCurrency;
    }

    try {
        const parsedLocale = new Intl.Locale(locale).maximize();
        const region = parsedLocale.region;
        if (!region) {
            return DEFAULT_CURRENCY;
        }
        return (countryToCurrency as Record<string, string>)[region] || DEFAULT_CURRENCY;
    } catch {
        return DEFAULT_CURRENCY;
    }
};

export const formatCurrency = (
    value: string | number | bigint | null,
    locale?: Intl.LocalesArgument,
    currency?: string,
) => {
    if (value === null) {
        return "";
    }

    const numeric = typeof value === "string" ? Number.parseFloat(value) : Number(value);
    if (!Number.isFinite(numeric)) {
        return "";
    }

    const normalizedLocale = Array.isArray(locale)
        ? locale.length
            ? String(locale[0])
            : undefined
        : locale
          ? String(locale)
          : undefined;
    const resolvedCurrency = currency?.toUpperCase() || getCurrencyByLocale(normalizedLocale);
    // if currency is empty, then format number.
    if (currency === "") {
        return new Intl.NumberFormat(normalizedLocale).format(numeric);
    }
    try {
        return new Intl.NumberFormat(normalizedLocale, {
            style: "currency",
            currency: resolvedCurrency,
        }).format(numeric);
    } catch {
        return new Intl.NumberFormat(normalizedLocale, {
            style: "currency",
            currency: getCurrencyByLocale(normalizedLocale),
        }).format(numeric);
    }
};
