import { CONVERSION_TABLE, IMPERIAL_REGIONS, MASS_CONVERSION_TABLE } from "./constants";
import { MeasureFormat, LengthUnit, MassUnit } from "./types";

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
