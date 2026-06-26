import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import type { FormatNumberOptions } from "react-intl";
import { Localize } from "../localize";

type FormatNumberArgs = {
    value: number;
    opts?: FormatNumberOptions;
};

const FormatNumberPreview = (args: FormatNumberArgs) => <p>{Localize.formatNumber(args.value, args.opts)}</p>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<FormatNumberArgs> = {
    title: "Values/FormatNumber",
    component: FormatNumberPreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, { args: { value, opts } }: { args: FormatNumberArgs }) => {
                    const o = opts ? `, ${JSON.stringify(opts)}` : "";
                    return `import { Localize } from "localize";\n\nLocalize.formatNumber(${value}${o});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        value: 1234567.89,
    },
    render: FormatNumberPreview,
};

export default meta;
type Story = StoryObj<FormatNumberArgs>;

/** Default number formatting for current locale. */
export const Default: Story = {};

/** Integer-only formatting (rounds to whole numbers). */
export const Integer: Story = {
    args: {
        value: 1234567.89,
        opts: { maximumFractionDigits: 0 },
    },
};

/** Fixed two-decimal formatting. */
export const TwoDecimals: Story = {
    args: {
        value: 1234567.89,
        opts: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    },
};

/** Currency formatting in USD. */
export const CurrencyUsd: Story = {
    args: {
        value: 1234.56,
        opts: { style: "currency", currency: "USD" },
    },
};

/** Percentage formatting from a decimal value. */
export const Percent: Story = {
    args: {
        value: 0.8734,
        opts: { style: "percent", maximumFractionDigits: 1 },
    },
};

/** Compact notation for large values (e.g. 1.2M). */
export const Compact: Story = {
    args: {
        value: 1234567,
        opts: { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 },
    },
};

/** Scientific notation for very large numbers. */
export const Scientific: Story = {
    args: {
        value: 987654321,
        opts: { notation: "scientific", maximumFractionDigits: 3 },
    },
};

/** Negative value formatting. */
export const NegativeValue: Story = {
    args: {
        value: -15342.78,
    },
};
