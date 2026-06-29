export type MeasureFormat = "metric" | "imperial";

export type ImperialLength = "ft" | "in" | "ft-in" | "mi" | "yd";
export type MetricLength = "cm" | "m" | "km" | "nm" | "μm" | "mm";
export type AstronomicalLength = "au" | "ly" | "pc" | "kpc" | "Mpc" | "Gpc" | "ls";

export type LengthUnit = ImperialLength | MetricLength | AstronomicalLength;

export type ImperialWeight = "oz" | "lb" | "st" | "ton" | "gr";
export type MetricWeight = "μg" | "mg" | "g" | "kg" | "t";
export type AstronomicalMass = "M_moon" | "M_earth" | "M_jup" | "M_sun";

export type MassUnit = ImperialWeight | MetricWeight | AstronomicalMass;
