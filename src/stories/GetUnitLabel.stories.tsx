import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";
import { getUnitLabel } from "../utilities/utilities";
import { LOCALE_OPTIONS } from "./constants";
import { SIMPLE_UNIT_OPTIONS } from "../utilities/constants";

const simpleUnitOptions =
    typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("unit") : [...SIMPLE_UNIT_OPTIONS];

const compoundUnitOptions = simpleUnitOptions.flatMap((numerator) =>
    simpleUnitOptions.map((denominator) => `${numerator}-per-${denominator}`),
);

const UNIT_OPTIONS = [...simpleUnitOptions, ...compoundUnitOptions] as Intl.NumberFormatOptions["unit"][];

type GetUnitLabelArgs = {
    unit: Intl.NumberFormatOptions["unit"];
    locale: string;
    quantity: number;
    usage: "utilities" | "instance";
};

const GetUnitLabelPreview = (args: GetUnitLabelArgs) => {
    if (args.usage === "utilities") {
        return <>{getUnitLabel(args.unit, args.locale, args.quantity)}</>;
    }

    return <>{Localize.getUnitLabel(args.unit, args.locale, args.quantity)}</>;
};

const meta: Meta<GetUnitLabelArgs> = {
    title: "Messages/GetUnitLabel",
    component: GetUnitLabelPreview,
    parameters: {
        disableLocaleDecorator: true,
        docs: {
            description: {
                component:
                    "There are over 2,000 ways that this function can return a useful value. <br /><br />Shows two ways to resolve localized unit labels: call `getUnitLabel` directly from utilities, or use `Localize.getUnitLabel` from the instance. <br /><br />The unit picker includes all Intl-supported simple units and all supported `<unit>-per-<unit>` combinations.",
            },
            source: {
                transform: (_src: string, context: { args: GetUnitLabelArgs }) => {
                    const { usage, unit, locale, quantity } = context.args;

                    if (usage === "utilities") {
                        return `import { getUnitLabel } from "@stamcat/localize/lib/utilities";\n\ngetUnitLabel("${unit}", "${locale}", ${quantity});`;
                    }

                    return `import Localize from "@stamcat/localize";\n\nLocalize.getUnitLabel("${unit}", "${locale}", ${quantity});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        unit: {
            control: { type: "select" },
            options: UNIT_OPTIONS,
        },
        locale: {
            control: { type: "select" },
            options: LOCALE_OPTIONS,
        },
        usage: {
            control: { type: "radio" },
            options: ["utilities", "instance"],
        },
        quantity: {
            control: { type: "number" },
        },
    },
    args: {
        unit: "day",
        locale: "en-GB",
        quantity: 0,
        usage: "utilities",
    },
    render: GetUnitLabelPreview,
};

export default meta;
type Story = StoryObj<GetUnitLabelArgs>;

/** Calls getUnitLabel directly from the utility module. */
export const DirectUtilityUsage: Story = {
    args: {
        usage: "utilities",
    },
};

/** Calls getUnitLabel from the Localize instance API. */
export const InstanceUsage: Story = {
    args: {
        usage: "instance",
    },
};
