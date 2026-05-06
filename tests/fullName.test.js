import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getFullName } from "../src/index.js";
import { NAMES } from "./_helpers.js";

describe("getFullName", () => {
    test("returns 'first last' string", () => {
        const full = getFullName();
        assert.equal(typeof full, "string");
        const parts = full.split(" ");
        assert.equal(parts.length, 2);
        assert.ok(parts[0].length > 0);
        assert.ok(parts[1].length > 0);
    });

    test("first part is in male or female list, second in last list", () => {
        for (let i = 0; i < 50; i++) {
            const [first, last] = getFullName().split(" ");
            const isFirst = NAMES.male.has(first) || NAMES.female.has(first);
            assert.ok(isFirst, `'${first}' not in any first-name list`);
            assert.ok(NAMES.last.has(last), `'${last}' not in last list`);
        }
    });

    test("gender:'male' yields male first name", () => {
        for (let i = 0; i < 50; i++) {
            const [first] = getFullName({ gender: "male" }).split(" ");
            assert.ok(NAMES.male.has(first));
        }
    });

    test("gender:'female' yields female first name", () => {
        for (let i = 0; i < 50; i++) {
            const [first] = getFullName({ gender: "female" }).split(" ");
            assert.ok(NAMES.female.has(first));
        }
    });

    test("throws on invalid gender", () => {
        assert.throws(() => getFullName({ gender: "x" }), /Only 'male' and 'female'/);
    });

    test("same seed produces identical full name", () => {
        assert.equal(getFullName({ seed: 42 }), getFullName({ seed: 42 }));
        assert.equal(getFullName({ seed: "abc" }), getFullName({ seed: "abc" }));
    });

    test("seed + explicit gender is deterministic", () => {
        const a = getFullName({ seed: 5, gender: "male" });
        const b = getFullName({ seed: 5, gender: "male" });
        assert.equal(a, b);
    });

    test("different seeds typically produce different full names", () => {
        const samples = new Set();
        for (let i = 0; i < 30; i++) samples.add(getFullName({ seed: i }));
        assert.ok(samples.size > 5);
    });

    test("uses two independent draws (full name lookups vary across seeds)", () => {
        // Sanity: across many seeds we should see varied last names too
        const lasts = new Set();
        for (let i = 0; i < 30; i++) {
            const [, last] = getFullName({ seed: i }).split(" ");
            lasts.add(last);
        }
        assert.ok(lasts.size > 3);
    });
});
