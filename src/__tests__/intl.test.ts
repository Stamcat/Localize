import type { IntlShape } from "react-intl";

const clientCreateIntlMock = jest.fn(() => ({ locale: "en-US" }) as IntlShape);
const clientCreateIntlCacheMock = jest.fn(() => ({}));
const serverCreateIntlMock = jest.fn(() => ({ locale: "en-US" }) as IntlShape);
const serverCreateIntlCacheMock = jest.fn(() => ({}));

jest.mock("react-intl", () => ({
    createIntl: clientCreateIntlMock,
    createIntlCache: clientCreateIntlCacheMock,
}));

jest.mock("react-intl/server", () => ({
    createIntl: serverCreateIntlMock,
    createIntlCache: serverCreateIntlCacheMock,
}));

jest.mock("flat", () => ({
    flatten: jest.fn(() => ({})),
}));

import { createIntlFunctions } from "../intl";
import { createLocalizeInstance } from "../storage";

describe("createIntlFunctions", () => {
    beforeEach(() => {
        clientCreateIntlMock.mockClear();
        clientCreateIntlCacheMock.mockClear();
        serverCreateIntlMock.mockClear();
        serverCreateIntlCacheMock.mockClear();
    });

    it("uses the client intl provider by default", () => {
        const intl = createIntlFunctions(createLocalizeInstance("en-US"));

        intl.appIntl();

        expect(clientCreateIntlMock).toHaveBeenCalledTimes(1);
        expect(clientCreateIntlCacheMock).toHaveBeenCalledTimes(1);
        expect(serverCreateIntlMock).not.toHaveBeenCalled();
        expect(serverCreateIntlCacheMock).not.toHaveBeenCalled();
    });

    it("uses the server intl provider when requested", () => {
        const intl = createIntlFunctions(createLocalizeInstance("en-US"), "server");

        intl.appIntl();

        expect(serverCreateIntlMock).toHaveBeenCalledTimes(1);
        expect(serverCreateIntlCacheMock).toHaveBeenCalledTimes(1);
        expect(clientCreateIntlMock).not.toHaveBeenCalled();
        expect(clientCreateIntlCacheMock).not.toHaveBeenCalled();
    });
});
