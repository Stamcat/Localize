import { Options } from "intl-messageformat";
import { MessageFormatElement } from "react-intl";

export type IntlMessageFormatOptions = Options;
export type IntlMessage = Record<string, string> | Record<string, MessageFormatElement[]> | undefined;

export type LegacyRaw =
    | "dd'.'MM'.'yyyy"
    | "dd'/'MM'/'yy"
    | "dd'/'MM'/'yyyy"
    | "M'/'d'/'yy"
    | "M'/'d'/'yyyy"
    | "MMM d 'd.'"
    | "MMMM Y"
    | "dd MMMM, yyyy"
    | "d MMMM"
    | "d'/'M'/'yyyy"
    | "yyyy'-'MM'-'dd";
export type LegacySkeleton = "MMMMd" | "MMMd" | "yMMdd" | "yMd";
export type LegacyDate = "full" | "long" | "medium" | "short";

export type LegacyDateFormat = {
    date?: LegacyDate;
    raw?: LegacyRaw;
    skeleton?: LegacySkeleton;
};

export type LegacyDateFormats = LegacyRaw & LegacyDate & LegacySkeleton;
