import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { getCurrencyByLocale } from "../utilities/utilities";
import { LOCALE_OPTIONS } from "./constants";

type GetCurrencyByLocaleArgs = {
    locale?: string;
};

const GetCurrencyByLocalePreview = (args: GetCurrencyByLocaleArgs) => <>{getCurrencyByLocale(args.locale)}</>;

const formatLocaleArg = (locale?: string) => (locale ? `"${locale}"` : "");

const meta: Meta<GetCurrencyByLocaleArgs> = {
    title: "Currency/GetCurrencyByLocale",
    component: GetCurrencyByLocalePreview,
    parameters: {
        disableLocaleDecorator: true,
        docs: {
            description: {
                component:
                    "Resolves a default ISO currency code from locale. It uses the locale's region, honors Unicode -u-cu- extension values, and falls back to USD when locale is missing or invalid.",
            },
            source: {
                transform: (_src: string, context: { args: GetCurrencyByLocaleArgs }) =>
                    `import { utilities } from "localize";\n\nutilities.getCurrencyByLocale(${formatLocaleArg(context.args.locale)});`,
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: { type: "select" },
            options: [...LOCALE_OPTIONS, "de-DE-u-cu-chf", "en-GB-u-cu-eur", ""],
        },
    },
    args: {
        locale: "en-GB",
    },
    render: GetCurrencyByLocalePreview,
};

export default meta;
type Story = StoryObj<GetCurrencyByLocaleArgs>;

/** Resolves currency from the locale region (e.g., en-GB -> GBP). */
export const LocaleRegionCurrency: Story = {};

/** Uses Unicode currency extension when present (e.g., de-DE-u-cu-chf -> CHF). */
export const UnicodeExtensionCurrency: Story = {
    args: {
        locale: "de-DE-u-cu-chf",
    },
};

/** Falls back to USD when locale is missing. */
export const FallbackToUsd: Story = {
    args: {
        locale: "",
    },
};
