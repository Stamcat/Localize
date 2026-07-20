import type { IntlShape } from "react-intl";

const clientCreateIntlMock = jest.fn(() => ({ locale: "en-US" }) as IntlShape);
const createIntlCacheMock = jest.fn(() => ({}));
const serverCreateIntlMock = jest.fn(() => ({ locale: "en-US" }) as IntlShape);

jest.mock("react-intl", () => ({
    createIntl: clientCreateIntlMock,
    createIntlCache: createIntlCacheMock,
}));

jest.mock("react-intl/server", () => ({
    createIntl: serverCreateIntlMock,
}));

jest.mock("flat", () => ({
    flatten: jest.fn(() => ({})),
}));

import { createIntlFunctions } from "../intl";
import { createLocalizeInstance } from "../storage";

describe("createIntlFunctions", () => {
    beforeEach(() => {
        clientCreateIntlMock.mockClear();
        createIntlCacheMock.mockClear();
        serverCreateIntlMock.mockClear();
    });

    it("uses the client intl provider by default", () => {
        const intl = createIntlFunctions(createLocalizeInstance("en-US"));

        intl.appIntl();

        expect(clientCreateIntlMock).toHaveBeenCalledTimes(1);
        expect(serverCreateIntlMock).not.toHaveBeenCalled();
    });

    it("uses the server intl provider when requested", () => {
        const intl = createIntlFunctions(createLocalizeInstance("en-US"), "server");

        intl.appIntl();

        expect(serverCreateIntlMock).toHaveBeenCalledTimes(1);
        expect(clientCreateIntlMock).not.toHaveBeenCalled();
    });
});
