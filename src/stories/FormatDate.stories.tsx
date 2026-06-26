import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { FormatDateOptions } from "react-intl";
import { Localize } from "../localize";

type FormatDateArgs = {
    value?: string | number | Date;
    opts?: FormatDateOptions;
};

const FormatDatePreview = (args: FormatDateArgs) => <p>{Localize.formatDate(args.value, args.opts)}</p>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<FormatDateArgs> = {
    title: "DateTime/FormatDate",
    component: FormatDatePreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, { args: { value, opts } }: { args: FormatDateArgs }) => {
                    const o = opts ? `, ${JSON.stringify(opts)}` : "";
                    return `import { Localize } from "localize";\n\nLocalize.formatDate(${value}${o});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        value: "01/29/1981",
    },
    render: FormatDatePreview,
};

export default meta;
type Story = StoryObj<FormatDateArgs>;

/** No opts — uses the locale's default date representation. */
export const Default: Story = {};

/** Short date: numeric month/day and 2-digit year (e.g. 1/29/81). */
export const ShortDate: Story = {
    args: {
        opts: { month: "numeric", day: "numeric", year: "2-digit" },
    },
};

/** Medium date: abbreviated month name, day, and full year (e.g. Jan 29, 1981). */
export const MediumDate: Story = {
    args: {
        opts: { month: "short", day: "numeric", year: "numeric" },
    },
};

/** Long date: full month name, day, and full year (e.g. January 29, 1981). */
export const LongDate: Story = {
    args: {
        opts: { month: "long", day: "numeric", year: "numeric" },
    },
};

/** Full date: includes weekday, full month name, day, and year (e.g. Thursday, January 29, 1981). */
export const FullDate: Story = {
    args: {
        opts: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    },
};

/** Month and day only — no year (e.g. January 29). */
export const MonthAndDay: Story = {
    args: {
        opts: { month: "long", day: "numeric" },
    },
};

/** Date with time — adds hour and minute to a long date. */
export const DateWithTime: Story = {
    args: {
        value: "1981-01-29T14:30:00",
        opts: { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" },
    },
};

/** Time only — shows hour, minute, and second without any date parts. */
export const TimeOnly: Story = {
    args: {
        value: "1981-01-29T14:30:45",
        opts: { hour: "numeric", minute: "2-digit", second: "2-digit" },
    },
};

/** Numeric timestamp (milliseconds since epoch) as the value. */
export const NumericTimestamp: Story = {
    args: {
        value: 349574400000,
    },
};

/** Passing no value — formatDate returns an empty string gracefully. */
export const EmptyValue: Story = {
    args: {
        value: undefined,
    },
};
