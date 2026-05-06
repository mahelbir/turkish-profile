import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getFirstName } from "../src/index.js";
import { NAMES } from "./_helpers.js";

describe("getFirstName", () => {
    test("returns a non-empty string with no args", () => {
        const name = getFirstName();
        assert.equal(typeof name, "string");
        assert.ok(name.length > 0);
    });

    test("returns a non-empty string when called with empty options", () => {
        assert.ok(getFirstName({}).length > 0);
    });

    test("gender:'male' always returns a name from the male list", () => {
        for (let i = 0; i < 100; i++) {
            const name = getFirstName({ gender: "male" });
            assert.ok(NAMES.male.has(name), `'${name}' is not in male list`);
        }
    });

    test("gender:'female' always returns a name from the female list", () => {
        for (let i = 0; i < 100; i++) {
            const name = getFirstName({ gender: "female" });
            assert.ok(NAMES.female.has(name), `'${name}' is not in female list`);
        }
    });

    test("throws on invalid gender", () => {
        assert.throws(() => getFirstName({ gender: "other" }), /Only 'male' and 'female'/);
        assert.throws(() => getFirstName({ gender: "MALE" }), /Only 'male' and 'female'/);
        assert.throws(() => getFirstName({ gender: 123 }), /Only 'male' and 'female'/);
    });

    test("same numeric seed produces identical output", () => {
        assert.equal(getFirstName({ seed: 42 }), getFirstName({ seed: 42 }));
        assert.equal(getFirstName({ seed: 0 }), getFirstName({ seed: 0 }));
        assert.equal(getFirstName({ seed: 999999 }), getFirstName({ seed: 999999 }));
    });

    test("same string seed produces identical output", () => {
        assert.equal(getFirstName({ seed: "turkey" }), getFirstName({ seed: "turkey" }));
        assert.equal(getFirstName({ seed: "" }), getFirstName({ seed: "" }));
    });

    test("different seeds usually produce different outputs", () => {
        const samples = new Set();
        for (let i = 0; i < 50; i++) samples.add(getFirstName({ seed: i }));
        assert.ok(samples.size > 5, `expected variety across seeds, got ${samples.size}`);
    });

    test("seed + gender combination is deterministic", () => {
        const a = getFirstName({ seed: 7, gender: "female" });
        const b = getFirstName({ seed: 7, gender: "female" });
        assert.equal(a, b);
        assert.ok(NAMES.female.has(a));
    });

    test("returned names are uppercase (matches CSV format)", () => {
        for (let i = 0; i < 20; i++) {
            const name = getFirstName({ seed: i });
            assert.equal(name, name.toUpperCase());
        }
    });

    test("seedless calls are non-deterministic", () => {
        const samples = new Set();
        for (let i = 0; i < 100; i++) samples.add(getFirstName());
        assert.ok(samples.size > 5, "expected randomness across seedless calls");
    });
});
