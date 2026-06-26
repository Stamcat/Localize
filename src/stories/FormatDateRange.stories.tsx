import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Localize } from "../localize";

type FormatDateRangeArgs = {
    from?: string | number | Date;
    to?: string | number | Date;
    opts?: Record<string, unknown>;
};

const FormatDateRangePreview = (args: FormatDateRangeArgs) => (
    <p>{Localize.formatDateRange(args.from, args.to, args.opts)}</p>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<FormatDateRangeArgs> = {
    title: "DateTime/FormatDateRange",
    component: FormatDateRangePreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, { args: { from, to, opts } }: { args: FormatDateRangeArgs }) => {
                    const f = typeof from === "string" ? `"${from}"` : String(from);
                    const t = typeof to === "string" ? `"${to}"` : String(to);
                    const o = opts ? `, ${JSON.stringify(opts)}` : "";
                    return `import { Localize } from "localize";\n\nLocalize.formatDateRange(${f}, ${t}${o});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        from: "1981-01-29",
        to: "1981-02-02",
    },
    render: FormatDateRangePreview,
};

export default meta;
type Story = StoryObj<FormatDateRangeArgs>;

/** No opts — uses the locale's default date range representation. */
export const Default: Story = {};

/** Short range with numeric month/day and 2-digit year. */
export const ShortDate: Story = {
    args: {
        opts: { month: "numeric", day: "numeric", year: "2-digit" },
    },
};

/** Medium range with abbreviated month name and full year. */
export const MediumDate: Story = {
    args: {
        opts: { month: "short", day: "numeric", year: "numeric" },
    },
};

/** Long range with full month name and year. */
export const LongDate: Story = {
    args: {
        opts: { month: "long", day: "numeric", year: "numeric" },
    },
};

/** Full range including weekday names. */
export const FullDate: Story = {
    args: {
        opts: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    },
};

/** Month/day range without year. */
export const MonthAndDay: Story = {
    args: {
        opts: { month: "long", day: "numeric" },
    },
};

/** Range with time included. */
export const DateWithTime: Story = {
    args: {
        from: "1981-01-29T14:30:00",
        to: "1981-01-29T18:45:00",
        opts: { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
    },
};

/** Time-only range (no date fields). */
export const TimeOnly: Story = {
    args: {
        from: "1981-01-29T14:30:45",
        to: "1981-01-29T15:45:30",
        opts: { hour: "numeric", minute: "2-digit", second: "2-digit" },
    },
};

/** Numeric timestamps (milliseconds since epoch) as range endpoints. */
export const NumericTimestamp: Story = {
    args: {
        from: 349574400000,
        to: 349920000000,
    },
};

/** Missing start/end returns an empty string gracefully. */
export const EmptyRange: Story = {
    args: {
        from: undefined,
        to: undefined,
    },
};
