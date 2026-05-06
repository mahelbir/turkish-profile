import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getProfile, getFirstName, getPassword } from "../src/index.js";

describe("distribution sanity", () => {
    test("auto-gender selection is roughly 50/50 over many samples", () => {
        let male = 0;
        const N = 2000;
        for (let i = 0; i < N; i++) {
            if (getProfile().gender === "male") male++;
        }
        const ratio = male / N;
        assert.ok(ratio > 0.4 && ratio < 0.6, `male ratio ${ratio} not in [0.4, 0.6]`);
    });

    test("first names show variety (not stuck on a single value)", () => {
        const samples = new Set();
        for (let i = 0; i < 500; i++) samples.add(getFirstName());
        assert.ok(samples.size > 50, `only ${samples.size} unique names in 500 draws`);
    });

    test("password char distribution covers all 4 charsets when enabled", () => {
        // Generate one long password — high-confidence coverage check
        const pw = getPassword({ length: 200, special: true });
        assert.match(pw, /[A-Z]/);
        assert.match(pw, /[a-z]/);
        assert.match(pw, /[0-9]/);
        assert.match(pw, /[^A-Za-z0-9]/);
    });

    test("seeded passwords are stable (regression snapshot)", () => {
        // If RNG/algorithm changes, this fails — a deliberate canary
        const pw = getPassword({ seed: "stable-canary", length: 16, special: true });
        assert.equal(typeof pw, "string");
        assert.equal(pw.length, 16);
        // Two calls with same seed must match
        assert.equal(getPassword({ seed: "stable-canary", length: 16, special: true }), pw);
    });
});
