import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Localize } from "../localize";

const GetLanguageCodePreview = () => <>{Localize.getLanguageCode()}</>;

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
    title: "Values/GetLanguageCode",
    component: GetLanguageCodePreview,
    parameters: {
        docs: {
            source: {
                transform: () => `import { Localize } from "localize";\n\nLocalize.getLanguageCode();`,
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {},
    args: {},
    render: GetLanguageCodePreview,
};

export default meta;
type Story = StoryObj;
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const GetLanguageCode: Story = {};
