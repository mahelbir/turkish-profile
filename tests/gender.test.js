import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getGender } from "../src/index.js";

describe("getGender", () => {
    test("returns 'male' or 'female' with no args", () => {
        for (let i = 0; i < 50; i++) {
            const g = getGender();
            assert.ok(g === "male" || g === "female", `unexpected: ${g}`);
        }
    });

    test("returns 'male' when gender:'male' is passed", () => {
        assert.equal(getGender({ gender: "male" }), "male");
        assert.equal(getGender({ gender: "male", seed: 1 }), "male");
    });

    test("returns 'female' when gender:'female' is passed", () => {
        assert.equal(getGender({ gender: "female" }), "female");
        assert.equal(getGender({ gender: "female", seed: 99 }), "female");
    });

    test("throws on invalid gender", () => {
        assert.throws(() => getGender({ gender: "x" }), /Only 'male' and 'female'/);
        assert.throws(() => getGender({ gender: "MALE" }), /Only 'male' and 'female'/);
        assert.throws(() => getGender({ gender: 123 }), /Only 'male' and 'female'/);
    });

    test("same seed produces identical output", () => {
        assert.equal(getGender({ seed: 42 }), getGender({ seed: 42 }));
        assert.equal(getGender({ seed: "abc" }), getGender({ seed: "abc" }));
        assert.equal(getGender({ seed: 0 }), getGender({ seed: 0 }));
    });

    test("seedless calls produce both values over many runs", () => {
        const seen = new Set();
        for (let i = 0; i < 200; i++) seen.add(getGender());
        assert.equal(seen.size, 2);
    });

    test("auto-gender is roughly 50/50 over many seeds", () => {
        let male = 0;
        const N = 2000;
        for (let i = 0; i < N; i++) {
            if (getGender({ seed: i }) === "male") male++;
        }
        const ratio = male / N;
        assert.ok(ratio > 0.4 && ratio < 0.6, `male ratio ${ratio}`);
    });
});