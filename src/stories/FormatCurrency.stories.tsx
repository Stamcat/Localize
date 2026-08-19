import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { createLocalize } from "../localize";
import { formatCurrency as formatCurrencyUtility } from "../utilities/utilities";
import { LOCALE_OPTIONS } from "./constants";

type FormatCurrencyArgs = {
    value: number;
    locale: string;
    currency?: string;
    mode: "utility" | "initializer";
};

const normalizeCurrency = (currency?: string): string | undefined => {
    if (currency === undefined) {
        return undefined;
    }

    const trimmed = currency.trim();
    return trimmed.length ? trimmed : "";
};

const FormatCurrencyPreview = ({ value, locale, currency, mode }: FormatCurrencyArgs) => {
    const activeCurrency = normalizeCurrency(currency);

    if (mode === "utility") {
        return <p>{formatCurrencyUtility(value, locale, activeCurrency)}</p>;
    }

    const localize = createLocalize("client", locale);
    localize.setLocale(locale);
    return <p>{localize.formatCurrency(value, locale, activeCurrency)}</p>;
};

const meta: Meta<FormatCurrencyArgs> = {
    title: "Currency/FormatCurrency",
    component: FormatCurrencyPreview,
    parameters: {
        disableLocaleDecorator: true,
        docs: {
            description: {
                component:
                    "Shows both ways to format currency: call the utility directly or call formatCurrency on a Localize instance created with createLocalize(). Pass an empty string (\"\") as currency to format as a plain number with no currency symbol.",
            },
            source: {
                transform: (_src: string, context: { args: FormatCurrencyArgs }) => {
                    const { value, locale, currency, mode } = context.args;
                    const activeCurrency = normalizeCurrency(currency);
                    const currencyArg = activeCurrency === undefined ? "" : `, ${JSON.stringify(activeCurrency)}`;

                    if (mode === "utility") {
                        return `import { utilities } from "localize";\n\nutilities.formatCurrency(${value}, "${locale}"${currencyArg});`;
                    }

                    return `import { createLocalize } from "localize";\n\nconst localize = createLocalize("client", "${locale}");\nlocalize.setLocale("${locale}");\nlocalize.formatCurrency(${value}, "${locale}"${currencyArg});`;
                },
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: { type: "select" },
            options: LOCALE_OPTIONS,
        },
        currency: {
            control: { type: "text" },
        },
        mode: {
            control: { type: "inline-radio" },
            options: ["utility", "initializer"],
        },
    },
    args: {
        value: 1234.56,
        locale: "de-DE",
        currency: "",
        mode: "utility",
    },
    render: FormatCurrencyPreview,
};

export default meta;
type Story = StoryObj<FormatCurrencyArgs>;

/** Calls the utility directly and resolves default currency from locale. */
export const UtilityLocaleResolved: Story = {
    args: {
        mode: "utility",
        locale: "en-GB",
        currency: undefined,
    },
};

/** Calls the utility directly and overrides currency to empty string, formatting as plain number. */
export const UtilityNoCurrencyOverride: Story = {
    args: {
        mode: "utility",
        locale: "de-DE",
        currency: "",
    },
};

/** Calls the utility directly and forces an explicit currency code. */
export const UtilityCurrencyOverride: Story = {
    args: {
        mode: "utility",
        locale: "de-DE",
        currency: "USD",
    },
};

/** Uses a Localize instance created with createLocalize() and locale-based currency resolution. */
export const InitializerLocaleResolved: Story = {
    args: {
        mode: "initializer",
        locale: "ja-JP",
        currency: undefined,
    },
};

/** Uses a Localize instance and overrides currency to empty string, formatting as plain number. */
export const InitializerNoCurrencyOverride: Story = {
    args: {
        mode: "initializer",
        locale: "fr-FR",
        currency: "",
    },
};

/** Uses a Localize instance created with createLocalize() and overrides currency explicitly. */
export const InitializerCurrencyOverride: Story = {
    args: {
        mode: "initializer",
        locale: "fr-FR",
        currency: "GBP",
    },
};
