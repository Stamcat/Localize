export type MeasureFormat = "metric" | "imperial";

export type ImperialLength = "ft" | "in" | "ft-in" | "mi" | "yd";
export type MetricLength = "cm" | "m" | "km" | "nm" | "μm" | "mm";
export type AstronomicalLength = "au" | "ly" | "pc" | "kpc" | "Mpc" | "Gpc" | "ls";

export type LengthUnit = ImperialLength | MetricLength | AstronomicalLength;

export type ImperialWeight = "oz" | "lb" | "st" | "ton" | "gr";
export type MetricWeight = "μg" | "mg" | "g" | "kg" | "t";
export type AstronomicalMass = "M_moon" | "M_earth" | "M_jup" | "M_sun";

export type MassUnit = ImperialWeight | MetricWeight | AstronomicalMass;

export type ImperialVolume = "tsp" | "tbsp" | "oz" | "cup" | "pt" | "qt" | "gal" | "in3";
export type MetricVolume = "ml" | "cl" | "dl" | "l" | "m3" | "cc";

export type VolumeUnit = ImperialVolume | MetricVolume;
