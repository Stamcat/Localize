import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";
import { LOCALE_OPTIONS } from "./constants";

type GetCountryCodeArgs = {
    locale: string;
};

const GetCountryCodePreview = (args: GetCountryCodeArgs) => {
    Localize.setLocale(args.locale);
    return <>{Localize.getCountryCode()}</>;
};

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<GetCountryCodeArgs> = {
    title: "Values/GetCountryCode",
    component: GetCountryCodePreview,
    parameters: {
        disableLocaleDecorator: true,
        docs: {
            source: {
                transform: (_src: string, context: { args: GetCountryCodeArgs }) =>
                    `import { Localize } from "localize";\n\nLocalize.setLocale("${context.args.locale}");\nLocalize.getCountryCode();`,
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: { type: "select" },
            options: LOCALE_OPTIONS,
        },
    },
    args: {
        locale: "en-GB",
    },
    render: GetCountryCodePreview,
};

export default meta;
type Story = StoryObj<GetCountryCodeArgs>;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const GetCountryCode: Story = {};
