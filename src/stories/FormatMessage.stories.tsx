import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { MessageDescriptor, PrimitiveType } from "react-intl";
import type { IntlMessageFormatOptions } from "../types";
import { Localize } from "../localize";

type FormatMessageArgs = {
    id: string;
    values?: Record<string, PrimitiveType>;
    descriptor?: MessageDescriptor;
    opts?: IntlMessageFormatOptions;
};

const FormatMessagePreview = (args: FormatMessageArgs) => (
    <p>{Localize.formatMessage(args.id, args.values, args.descriptor, args.opts)}</p>
);

const toArgSource = (value: unknown) => (typeof value === "string" ? `"${value}"` : JSON.stringify(value));

const meta: Meta<FormatMessageArgs> = {
    title: "Messages/FormatMessage",
    component: FormatMessagePreview,
    parameters: {
        docs: {
            source: {
                transform: (_src: string, context: { args: FormatMessageArgs }) => {
                    const props = context.args;
                    const args = [props.id, props.values, props.descriptor, props.opts]
                        .filter((value) => value !== undefined)
                        .map(toArgSource)
                        .join(", ");
                    return `import { Localize } from "localize";\n\nLocalize.formatMessage(${args});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {
        id: "report-header/report-title",
    },
    render: FormatMessagePreview,
};

export default meta;
type Story = StoryObj<FormatMessageArgs>;

/** Formats a simple message by translation id. */
export const Default: Story = {};

/** Injects primitive variables into the message template. */
export const WithValues: Story = {
    args: {
        id: "message/success-confirmation",
        values: {
            val: Localize.formatNumber(7000),
        },
    },
};

/** Provides descriptor metadata and fallback default text for missing translations. */
export const WithDescriptorFallback: Story = {
    args: {
        id: "missing",
        descriptor: {
            defaultMessage: "Missing Translation Value",
        },
    },
};

/** Uses values and descriptor together to mirror a full real-world call. */
export const FullyOptioned: Story = {
    args: {
        id: "message/success-confirmation",
        values: {
            val: Localize.formatNumber(7000),
        },
        descriptor: {
            description: "Send Success Message",
            defaultMessage: "Your Message has sent successfully.",
        },
    },
};

/** Empty id returns an empty string (guard behavior). */
export const EmptyId: Story = {
    args: {
        id: "",
    },
};
