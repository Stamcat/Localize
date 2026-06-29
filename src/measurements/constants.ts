import { LengthUnit, MassUnit } from "./types";

export const IMPERIAL_REGIONS = ["US", "LR", "MM"] as const;
/**
 * Conversion factors to meters (base unit).
 * "ft-in" is a compound display unit — it cannot be used as a conversion base.
 */
export const CONVERSION_TABLE: Record<Exclude<LengthUnit, "ft-in">, number> = {
    // Metric
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1_000,
    nm: 1e-9,
    μm: 1e-6,
    // Imperial
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1_609.344,
    // Astronomical
    au: 1.495_978_707e11,
    ls: 299_792_458,
    ly: 9.460_730_472_580_8e15,
    pc: 3.085_677_581_491_367e16,
    kpc: 3.085_677_581_491_367e19,
    Mpc: 3.085_677_581_491_367e22,
    Gpc: 3.085_677_581_491_367e25,
};

/**
 * Conversion factors to kilograms (base unit).
 */
export const MASS_CONVERSION_TABLE: Record<MassUnit, number> = {
    // Metric
    μg: 1e-9,
    mg: 1e-6,
    g: 1e-3,
    kg: 1,
    t: 1_000,
    // Imperial
    gr: 6.479_891e-5,
    oz: 0.028_349_523_125,
    lb: 0.453_592_37,
    st: 6.350_293_18,
    ton: 907.184_74,
    // Astronomical
    M_moon: 7.342e22,
    M_earth: 5.972_2e24,
    M_jup: 1.898_13e27,
    M_sun: 1.988_47e30,
};
