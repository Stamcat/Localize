# @stamcat/localize

A lightweight localization helper built on top of `react-intl` and `intl-messageformat`.

This package provides:

-   Locale state management
-   Message storage and merging
-   Message, number, and date formatting utilities
-   Country/language/measurement helpers
-   A singleton for client usage and an instance factory for server usage

The API in this README is based on the source implementation in `src/localize.ts` (the TypeScript source that compiles to JavaScript) and Storybook examples in `src/stories`.

## Installation

### 1) Install the package

```bash
npm install @stamcat/localize
```

### 2) If you install from GitHub Packages

This package is configured for GitHub Packages. Make sure your npm config includes the scope registry and an auth token.

```ini
@stamcat:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then run:

```bash
npm install @stamcat/localize
```

## Basic Usage (Client)

Use the default singleton for most client-side apps:

```ts
import Localize from "@stamcat/localize";

Localize.setLocale("en-GB");

Localize.setTranslations({
    "report-header/report-title": "Monthly Report",
    "message/success-confirmation": "Sent successfully: {val}",
});

const title = Localize.formatMessage("report-header/report-title");
const success = Localize.formatMessage("message/success-confirmation", {
    val: Localize.formatNumber(7000),
});
const date = Localize.formatDate("1981-01-29", { month: "long", day: "numeric", year: "numeric" });
const range = Localize.formatDateRange("1981-01-29", "1981-02-02", {
    month: "short",
    day: "numeric",
    year: "numeric",
});
```

## Server Usage (SSR)

Create isolated instances to avoid shared state across requests, and pass the server provider mode so the instance uses `react-intl/server`.

```ts
import { cache } from "react";
import { createLocalize } from "@stamcat/localize";

export const localize = cache(() => createLocalize("server", "en-US"));

// Per request / render
localize().setLocale("de-DE");
localize().setTranslations({
    "report-header/report-title": "Monatsbericht",
});

const title = localize().formatMessage("report-header/report-title");
```

`createLocalize(provider, locale)` supports:

-   `"client"` (default): uses `react-intl`
-   `"server"`: uses `react-intl/server`

## Loading and Managing Messages

### Replace all messages

```ts
Localize.setTranslations({
    "home.title": "Welcome",
    "home.subtitle": "Good to see you",
});
```

### Append (merge) messages

```ts
Localize.appendMessages({
    "checkout.title": "Checkout",
});
```

### Prepare nested API payloads

If your API returns nested objects, flatten them first:

```ts
const apiPayload = {
    home: {
        title: "Welcome",
        subtitle: "Good to see you",
    },
};

const prepared = Localize.prepareMessages("en-US", apiPayload);
Localize.setTranslations(prepared);
```

### Change locale and replace messages in one call

```ts
Localize.changeLocale("es-US", {
    report: {
        title: "Informe",
    },
});
```

## Utility Methods

```ts
Localize.getLocale(); // e.g. "en-GB"
Localize.getLanguageCode(); // e.g. "en"
Localize.getCountryCode(); // e.g. "GB"
Localize.getCountryName("en-GB");
Localize.getCountryName("de-DE", "en-US");
Localize.getMeasureFormat(); // "metric" | "imperial"
Localize.getMeasureFormat("en-US");
```

## Message Formatting Notes

`formatMessage(id, values, descriptor, opts)` supports:

-   `id`: translation key
-   `values`: interpolation values
-   `descriptor.defaultMessage`: fallback text if translation is missing

Example:

```ts
Localize.formatMessage("missing.key", undefined, { defaultMessage: "Fallback text" });
```

Also available:

-   `message(rawMessage, values, overrideFormats, opts)` for formatting ad-hoc message strings without an ID.

## Storybook References

Examples for each API are demonstrated in Storybook stories:

-   `src/stories/FormatMessage.stories.tsx`
-   `src/stories/FormatDate.stories.tsx`
-   `src/stories/FormatDateRange.stories.tsx`
-   `src/stories/FormatNumber.stories.tsx`
-   `src/stories/GetCountryCode.stories.tsx`
-   `src/stories/GetCountryName.stories.tsx`
-   `src/stories/GetLanguageCode.stories.tsx`
-   `src/stories/GetMeasureFormat.stories.tsx`
-   `src/stories/Introduction.mdx`

Run Storybook locally:

```bash
npm run storybook
```

## Exports

-   Default export: singleton `Localize`
-   Named export: `createLocalize`

```ts
import Localize, { createLocalize } from "@stamcat/localize";
```

## License

MIT
