# AGENTS.md

## Purpose

This package is a stateful localization helper built on top of `react-intl` and `intl-messageformat`.
It does not expose a React provider component or a hook API.
AI agents should use the exported helper instance APIs directly.

## Imports

Client-side code:

```ts
import Localize from "@stamcat/localize";
```

Isolated instances, including SSR:

```ts
import { createLocalize } from "@stamcat/localize";
```

## Choose the Right Entry Point

Use the default singleton `Localize` for client-only code.

```ts
Localize.setLocale("en-GB");
Localize.setTranslations({
    "home/title": "Welcome",
});

const title = Localize.formatMessage("home/title");
```

Use `createLocalize()` when state must be isolated.
This is required for server-side rendering and any per-request usage.

```ts
const localize = createLocalize("en-US", "server");
```

`createLocalize(defaultLocale?, provider?)` supports:

-   `"client"` as the default provider
-   `"server"` to use `react-intl/server`

## SSR Rules

For SSR, always create a fresh or request-scoped instance.
Do not use the default singleton across requests.

Preferred pattern:

```ts
import { cache } from "react";
import { createLocalize } from "@stamcat/localize";

export const localize = cache(() => createLocalize("en-US", "server"));
```

Before formatting, set the locale and messages for that request.

```ts
localize().setLocale("de-DE");
localize().setTranslations({
    "report/title": "Monatsbericht",
});
```

## Message Loading

Messages are expected to be flat key-value objects when passed to `setTranslations()`.
If upstream data is nested, flatten it first with `prepareMessages()`.
The default delimiter is `/`.

```ts
const prepared = Localize.prepareMessages("en-US", {
    report: {
        title: "Monthly Report",
    },
});

Localize.setTranslations(prepared);
```

Use `appendMessages()` to merge additional flat messages into the current set.
Use `changeLocale()` to switch locale and optionally replace messages in one call.

## Formatting APIs

Primary methods:

-   `formatMessage(id, values?, descriptor?, opts?)`
-   `formatDate(value, opts?)`
-   `formatDateRange(from, to, opts?)`
-   `formatNumber(value, opts?)`
-   `message(rawMessage, values?, overrideFormats?, opts?)`

Use `formatMessage()` for translation IDs.
Use `message()` only for ad-hoc strings that do not come from the translation store.

Example:

```ts
Localize.formatMessage("checkout/success", { count: 3 }, { defaultMessage: "Done" });
```

## Locale Helpers

Available helpers on the instance:

-   `getLocale()`
-   `setLocale(locale)`
-   `getLanguageCode()`
-   `getCountryCode()`
-   `getCountryName(locale, localizedTo?)`
-   `getAllMessages()`

## Measurement Helpers

Measurement helpers live under the nested `measure` object.
Do not call `Localize.getMeasureFormat()`.
Use:

-   `Localize.measure.getFormat(locale?)`
-   `Localize.measure.convertLength(value, from, to)`
-   `Localize.measure.convertWeight(value, from, to)`

Example:

```ts
const system = Localize.measure.getFormat("en-US");
const miles = Localize.measure.convertLength(1000, "m", "mi");
```

## Testing Behavior

In test environments where `NODE_ENV === "test"`, `formatMessage()` returns the message ID instead of a translated string.
Agents writing tests should assert against IDs unless they intentionally bypass that behavior.

## Avoid These Mistakes

-   Do not invent a React context provider, hook, or component API for this package.
-   Do not use the default singleton for SSR or any shared server process state.
-   Do not pass nested translation objects directly to `setTranslations()` unless they were flattened first.
-   Do not assume the library manages message fetching; loading data is the caller's responsibility.
-   Do not use `message()` as a replacement for translation IDs stored in the message catalog.

## Canonical References

When in doubt, use these files as the source of truth:

-   `src/localize.ts`
-   `src/intl.ts`
-   `README.md`
