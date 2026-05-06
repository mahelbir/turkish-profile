import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getPassword } from "../src/index.js";

const UPPER = /[A-Z]/;
const LOWER = /[a-z]/;
const NUMBER = /[0-9]/;
const SPECIAL = /[^A-Za-z0-9]/;

describe("getPassword", () => {
    test("default length is 8", () => {
        assert.equal(getPassword().length, 8);
    });

    test("default charsets: uppercase + lowercase + numbers (no special)", () => {
        // Over many samples, special chars must NEVER appear by default
        for (let i = 0; i < 100; i++) {
            const pw = getPassword({ length: 32 });
            assert.ok(!SPECIAL.test(pw), `unexpected special in '${pw}'`);
        }
    });

    test("respects custom length", () => {
        for (const len of [4, 8, 16, 32, 64, 128]) {
            assert.equal(getPassword({ length: len }).length, len);
        }
    });

    test("includes special chars when special:true", () => {
        // Length 64 + special:true → with extreme high probability contains a special char
        const pw = getPassword({ length: 64, special: true });
        assert.equal(pw.length, 64);
        assert.ok(SPECIAL.test(pw));
    });

    test("contains at least one of every enabled charset", () => {
        // Algorithm guarantees this by construction
        for (let i = 0; i < 50; i++) {
            const pw = getPassword({ length: 16, special: true });
            assert.ok(UPPER.test(pw), `missing uppercase: ${pw}`);
            assert.ok(LOWER.test(pw), `missing lowercase: ${pw}`);
            assert.ok(NUMBER.test(pw), `missing number: ${pw}`);
            assert.ok(SPECIAL.test(pw), `missing special: ${pw}`);
        }
    });

    test("uppercase-only", () => {
        const pw = getPassword({ length: 16, uppercase: true, lowercase: false, numbers: false });
        assert.match(pw, /^[A-Z]+$/);
    });

    test("lowercase-only", () => {
        const pw = getPassword({ length: 16, uppercase: false, lowercase: true, numbers: false });
        assert.match(pw, /^[a-z]+$/);
    });

    test("numbers-only", () => {
        const pw = getPassword({ length: 16, uppercase: false, lowercase: false, numbers: true });
        assert.match(pw, /^[0-9]+$/);
    });

    test("special-only", () => {
        const pw = getPassword({
            length: 16,
            uppercase: false,
            lowercase: false,
            numbers: false,
            special: true,
        });
        assert.ok(!UPPER.test(pw));
        assert.ok(!LOWER.test(pw));
        assert.ok(!NUMBER.test(pw));
    });

    test("throws when all charsets disabled", () => {
        assert.throws(
            () => getPassword({ uppercase: false, lowercase: false, numbers: false, special: false }),
            /At least one character set/,
        );
    });

    test("throws when length < number of enabled charsets", () => {
        assert.throws(
            () => getPassword({ length: 2, uppercase: true, lowercase: true, numbers: true }),
            /Password length must be at least 3/,
        );
        assert.throws(
            () => getPassword({ length: 3, uppercase: true, lowercase: true, numbers: true, special: true }),
            /Password length must be at least 4/,
        );
    });

    test("length=1 with single charset works", () => {
        const pw = getPassword({ length: 1, uppercase: true, lowercase: false, numbers: false });
        assert.equal(pw.length, 1);
        assert.match(pw, /^[A-Z]$/);
    });

    test("same seed produces identical password", () => {
        assert.equal(
            getPassword({ seed: "test", length: 16, special: true }),
            getPassword({ seed: "test", length: 16, special: true }),
        );
        assert.equal(getPassword({ seed: 0 }), getPassword({ seed: 0 }));
    });

    test("different seeds produce different passwords", () => {
        const samples = new Set();
        for (let i = 0; i < 50; i++) samples.add(getPassword({ seed: i, length: 12 }));
        assert.ok(samples.size > 40, `expected mostly unique seeds, got ${samples.size}`);
    });

    test("seedless calls are non-deterministic", () => {
        const samples = new Set();
        for (let i = 0; i < 50; i++) samples.add(getPassword({ length: 12 }));
        assert.ok(samples.size > 40);
    });

    test("seeded password matches options exactly across runs", () => {
        const opts = { seed: "snapshot-1", length: 12, uppercase: true, lowercase: true, numbers: true, special: true };
        const pw = getPassword(opts);
        // Run twice more — must always produce same value
        assert.equal(getPassword(opts), pw);
        assert.equal(getPassword(opts), pw);
    });
});
