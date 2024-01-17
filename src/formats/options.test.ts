import { getFullOptions } from "./options.js";

import { expect, test } from "vitest";

test("default options are valid", () => {
    expect(Object.keys(getFullOptions())).toHaveLength(12);
});
