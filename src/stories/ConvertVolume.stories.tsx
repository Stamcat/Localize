import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";
import type { VolumeUnit } from "../utilities/types";

const UNIT_OPTIONS: VolumeUnit[] = [
    // Imperial (US customary)
    "tsp",
    "tbsp",
    "oz",
    "cup",
    "pt",
    "qt",
    "gal",
    "in3",
    // Metric
    "ml",
    "cc",
    "cl",
    "dl",
    "l",
    "m3",
];

type ConvertVolumeArgs = {
    value: number;
    from: VolumeUnit;
    to: VolumeUnit;
    maximumFractionDigits: number;
};

const ConvertVolumePreview = ({ value, from, to, maximumFractionDigits }: ConvertVolumeArgs) => {
    const result = Localize.measure.convertVolume(value, from, to);
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

const meta: Meta<ConvertVolumeArgs> = {
    title: "Measurements/ConvertVolume",
    component: ConvertVolumePreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, context: { args: ConvertVolumeArgs }) => {
                    const { value, from, to, maximumFractionDigits } = context.args;
                    return `import { Localize } from "@stamcat/localize";\n\nconst result = Localize.measure.convertVolume(${value}, "${from}", "${to}");\nLocalize.formatNumber(result ?? 0, { maximumFractionDigits: ${maximumFractionDigits} });`;
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
        value: 16,
        from: "oz",
        to: "ml",
        maximumFractionDigits: 4,
    },
    render: ConvertVolumePreview,
};

export default meta;
type Story = StoryObj<ConvertVolumeArgs>;

/** Fluid ounces to milliliters, formatted in US English. */
export const OuncesToMilliliters: Story = {};
