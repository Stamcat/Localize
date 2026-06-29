import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";
import type { MassUnit } from "../measurements/types";

const UNIT_OPTIONS: MassUnit[] = [
    // Imperial
    "gr",
    "oz",
    "lb",
    "st",
    "ton",
    // Metric
    "μg",
    "mg",
    "g",
    "kg",
    "t",
    // Astronomical
    "M_moon",
    "M_earth",
    "M_jup",
    "M_sun",
];

type ConvertWeightArgs = {
    value: number;
    from: MassUnit;
    to: MassUnit;
    maximumFractionDigits: number;
};

const ConvertWeightPreview = ({ value, from, to, maximumFractionDigits }: ConvertWeightArgs) => {
    const result = Localize.measure.convertWeight(value, from, to);
    const activeLocale = Localize.getLocale();

    if (result === null) {
        return <p>Invalid input</p>;
    }

    const formattedInput = Localize.formatNumber(value, { maximumFractionDigits });
    const formattedResult = Localize.formatNumber(result, { maximumFractionDigits });

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

const meta: Meta<ConvertWeightArgs> = {
    title: "Measurements/ConvertWeight",
    component: ConvertWeightPreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, context: { args: ConvertWeightArgs }) => {
                    const { value, from, to, maximumFractionDigits } = context.args;
                    return `import { Localize } from "@stamcat/localize";\n\nconst result = Localize.measure.convertWeight(${value}, "${from}", "${to}");\nLocalize.formatNumber(result ?? 0, { maximumFractionDigits: ${maximumFractionDigits} });`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: { type: "number" },
        },
        from: {
            control: { type: "select" },
            options: UNIT_OPTIONS,
        },
        to: {
            control: { type: "select" },
            options: UNIT_OPTIONS,
        },
        maximumFractionDigits: {
            control: { type: "number" },
        },
    },
    args: {
        value: 100,
        from: "lb",
        to: "kg",
        maximumFractionDigits: 4,
    },
    render: ConvertWeightPreview,
};

export default meta;
type Story = StoryObj<ConvertWeightArgs>;

/** Pounds to kilograms, formatted in US English. */
export const PoundsToKilograms: Story = {};

/** Ounces to grams for small values. */
export const OuncesToGrams: Story = {
    args: {
        value: 16,
        from: "oz",
        to: "g",
        maximumFractionDigits: 2,
    },
};

/** Earth masses to solar masses for very large-scale conversions. */
export const EarthToSolarMass: Story = {
    args: {
        value: 1,
        from: "M_earth",
        to: "M_sun",
        maximumFractionDigits: 10,
    },
};

/** Returns null for non-finite input. */
export const InvalidInput: Story = {
    args: {
        value: Number.NaN,
        from: "kg",
        to: "lb",
    },
};
