import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";

type GetCountryNameArgs = {
    locale: string;
    localizedTo?: string;
};

const LOCALE_OPTIONS = [
    // North America
    "en-US",
    "es-MX",
    "fr-CA",
    // South America
    "pt-BR",
    "es-AR",
    "es-CO",
    // Europe
    "en-GB",
    "fr-FR",
    "fr-BE",
    "nl-NL",
    "de-DE",
    "de-AT",
    "de-CH",
    "fr-CH",
    "pl-PL",
    "tr-TR",
    // Africa
    "ar-EG",
    "en-ZA",
    "sw-KE",
    // Asia
    "hi-IN",
    "ja-JP",
    "ko-KR",
    // Oceania
    "en-AU",
    "en-NZ",
    "fr-PF",
    // Antarctica
    "en-AQ",
];

const GetCountryNamePreview = (args: GetCountryNameArgs) => (
    <>{Localize.getCountryName(args.locale, args.localizedTo)}</>
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<GetCountryNameArgs> = {
    title: "Values/GetCountryName",
    component: GetCountryNamePreview,
    parameters: {
        disableLocaleDecorator: true,
        docs: {
            source: {
                transform: (_src: string, context: { args: GetCountryNameArgs }) =>
                    `import { Localize } from "localize";\n\nLocalize.getCountryName("${context.args.locale}");`,
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: { type: "select" },
            options: LOCALE_OPTIONS,
        },
        localizedTo: {
            control: { type: "select" },
            options: LOCALE_OPTIONS,
        },
    },
    args: {
        locale: "en-GB",
        localizedTo: undefined,
    },
    render: GetCountryNamePreview,
};

export default meta;
type Story = StoryObj<GetCountryNameArgs>;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const GetCountryName: Story = {};
