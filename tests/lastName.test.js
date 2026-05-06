import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getLastName } from "../src/index.js";
import { NAMES } from "./_helpers.js";

describe("getLastName", () => {
    test("returns a non-empty string with no args", () => {
        const name = getLastName();
        assert.equal(typeof name, "string");
        assert.ok(name.length > 0);
    });

    test("always returns a name from the last name list", () => {
        for (let i = 0; i < 200; i++) {
            const name = getLastName();
            assert.ok(NAMES.last.has(name), `'${name}' is not in last name list`);
        }
    });

    test("same seed produces identical output", () => {
        assert.equal(getLastName({ seed: 42 }), getLastName({ seed: 42 }));
        assert.equal(getLastName({ seed: "x" }), getLastName({ seed: "x" }));
    });

    test("different seeds usually produce different outputs", () => {
        const samples = new Set();
        for (let i = 0; i < 50; i++) samples.add(getLastName({ seed: i }));
        assert.ok(samples.size > 5);
    });

    test("returned names are uppercase", () => {
        const name = getLastName({ seed: 1 });
        assert.equal(name, name.toUpperCase());
    });

    test("ignores gender option silently if passed (no error)", () => {
        // gender is not a documented option for getLastName; should not break if passed
        assert.doesNotThrow(() => getLastName({ gender: "male", seed: 1 }));
    });
});
