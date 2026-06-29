import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";
import type { LengthUnit } from "../measurements/types";

const UNIT_OPTIONS: LengthUnit[] = [
    // Imperial
    "in",
    "ft",
    "ft-in",
    "yd",
    "mi",
    // Metric
    "mm",
    "cm",
    "m",
    "km",
    "nm",
    "μm",
    // Astronomical
    "au",
    "ls",
    "ly",
    "pc",
    "kpc",
    "Mpc",
    "Gpc",
];

type ConvertLengthArgs = {
    value: number;
    from: LengthUnit;
    to: LengthUnit;
    maximumFractionDigits: number;
};

const ConvertLengthPreview = ({ value, from, to, maximumFractionDigits }: ConvertLengthArgs) => {
    const result = Localize.measure.convertLength(value, from, to);
    const activeLocale = Localize.getLocale();

    if (result === null) {
        return <p>Invalid input</p>;
    }

    const formattedInput = Localize.formatNumber(value, { maximumFractionDigits });
    const formattedResult = Localize.formatNumber(result, { maximumFractionDigits });

    if (to === "ft-in") {
        const feet = Math.floor(result);
        const inches = Math.round((result % 1) * 12);
        const formattedFeet = Localize.formatNumber(feet, { maximumFractionDigits: 0 });
        const formattedInches = Localize.formatNumber(inches, { maximumFractionDigits: 0 });
        return (
            <div style={{ display: "grid", gap: "8px" }}>
                <p>
                    Raw: {value} {from} = {feet} ft {inches} in
                </p>
                <p>
                    Locale ({activeLocale}): {formattedInput} {from} = {formattedFeet} ft {formattedInches} in
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "grid", gap: "8px" }}>
            <p>
                Raw: {value} {from} = {result} {to}
            </p>
            <p>
                Locale ({activeLocale}): {formattedInput} {from} = {formattedResult} {to}
            </p>
        </div>
    );
};

const meta: Meta<ConvertLengthArgs> = {
    title: "Measurements/ConvertLength",
    component: ConvertLengthPreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, context: { args: ConvertLengthArgs }) => {
                    const { value, from, to, maximumFractionDigits } = context.args;
                    return `import { Localize } from "@stamcat/localize";\n\nconst result = Localize.measure.convertLength(${value}, "${from}", "${to}");\nLocalize.formatNumber(result ?? 0, { maximumFractionDigits: ${maximumFractionDigits} });`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        from: {
            control: { type: "select" },
            options: UNIT_OPTIONS,
        },
        to: {
            control: { type: "select" },
            options: UNIT_OPTIONS,
        },
        value: {
            control: { type: "number" },
        },
        maximumFractionDigits: {
            control: { type: "number" },
        },
    },
    args: {
        value: 1,
        from: "m",
        to: "ft",
        maximumFractionDigits: 4,
    },
    render: ConvertLengthPreview,
};

export default meta;
type Story = StoryObj<ConvertLengthArgs>;

/** Meters to feet. */
export const MetersToFeet: Story = {};

/** Miles to kilometers. */
export const MilesToKilometers: Story = {
    args: { value: 26.2, from: "mi", to: "km", maximumFractionDigits: 3 },
};

/** Centimeters to feet and inches (compound ft-in display). */
export const CentimetersToFeetInches: Story = {
    args: { value: 180, from: "cm", to: "ft-in", maximumFractionDigits: 2 },
};

/** Kilometers to miles. */
export const KilometersToMiles: Story = {
    args: { value: 100, from: "km", to: "mi", maximumFractionDigits: 4 },
};

/** Inches to centimeters. */
export const InchesToCentimeters: Story = {
    args: { value: 12, from: "in", to: "cm", maximumFractionDigits: 2 },
};

/** Astronomical units to kilometers. */
export const AstronomicalUnitsToKilometers: Story = {
    args: { value: 1, from: "au", to: "km", maximumFractionDigits: 2 },
};

/** Light-years to parsecs. */
export const LightYearsToParsecs: Story = {
    args: { value: 1, from: "ly", to: "pc", maximumFractionDigits: 10 },
};

/** Returns null for non-numeric input. */
export const InvalidInput: Story = {
    args: { value: Number.NaN, from: "m", to: "ft", maximumFractionDigits: 2 },
};
