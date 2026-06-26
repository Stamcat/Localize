import { Locale } from "../storage";

describe("storage", () => {
    describe("Locale", () => {
        it("interfaces with the objects in storage", () => {
            expect(Locale.getLocale()).toBe("en-US");
        });
    });
});
