import type { Decorator, Preview } from "@storybook/react";
import { applyLocale, LocaleDecorator } from "./decorators/LocaleDecorator";

applyLocale("en-GB");

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [LocaleDecorator],
};

export default preview;
