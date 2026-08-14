import { formatCurrency } from "../utilities/utilities";

describe("formatCurrency", () => {
    it("resolves GBP for en-GB when no currency override is provided", () => {
        const value = 1234.56;
        const locale = "en-GB";

        expect(formatCurrency(value, locale)).toBe(
            new Intl.NumberFormat(locale, { style: "currency", currency: "GBP" }).format(value),
        );
    });

    it("resolves EUR for de-DE when no currency override is provided", () => {
        const value = 1234.56;
        const locale = "de-DE";

        expect(formatCurrency(value, locale)).toBe(
            new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(value),
        );
    });

    it("uses the provided currency instead of locale-resolved currency", () => {
        const value = 1234.56;
        const locale = "de-DE";
        const currency = "USD";

        expect(formatCurrency(value, locale, currency)).toBe(
            new Intl.NumberFormat(locale, { style: "currency", currency }).format(value),
        );
    });

    it("returns an empty string for null or non-finite values", () => {
        expect(formatCurrency(null, "en-US")).toBe("");
        expect(formatCurrency("not-a-number", "en-US")).toBe("");
    });
});
