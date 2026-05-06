import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getUsername } from "../src/index.js";

describe("getUsername", () => {
    test("returns lowercase base + 4-digit suffix by default", () => {
        for (let i = 0; i < 30; i++) {
            const u = getUsername({ seed: i });
            assert.match(u, /^[a-z0-9_]{1,11}\d{4}$/);
            assert.ok(u.length <= 15);
        }
    });

    test("same seed produces identical output", () => {
        assert.equal(getUsername({ seed: 42 }), getUsername({ seed: 42 }));
        assert.equal(getUsername({ seed: "abc" }), getUsername({ seed: "abc" }));
    });

    test("seedless calls are non-deterministic", () => {
        const seen = new Set();
        for (let i = 0; i < 10; i++) seen.add(getUsername());
        assert.ok(seen.size > 1);
    });

    test("respects provided firstName + lastName", () => {
        const u = getUsername({ seed: 1, firstName: "Ali", lastName: "Veli" });
        assert.match(u, /^aliveli\d{4}$/);
    });

    test("non-alphanumeric chars become replacement", () => {
        const u = getUsername({
            seed: 1,
            firstName: "Ayşe",
            lastName: "Yıl maz!",
            replacement: "_",
        });
        assert.ok(u.startsWith("ay_ey_l_maz") || u.startsWith("ay_ey_l_ma"));
        assert.match(u, /^[a-z_]+\d{4}$/);
    });

    test("replacement char is configurable", () => {
        const u = getUsername({
            seed: 1,
            firstName: "Ayşe",
            lastName: "Çelik",
            replacement: ".",
        });
        assert.ok(!u.includes("_"));
        assert.match(u, /^[a-z.]+\d{4}$/);
    });

    test("maxLength caps total length", () => {
        for (const maxLength of [6, 8, 10, 15, 20, 30]) {
            const u = getUsername({ seed: 1, maxLength });
            assert.ok(u.length <= maxLength, `${u} > ${maxLength}`);
            assert.match(u.slice(-4), /^\d{4}$/);
        }
    });

    test("maxLength = 6 yields 2-char base + 4-digit suffix", () => {
        const u = getUsername({ seed: 1, firstName: "Ali", lastName: "Veli", maxLength: 6 });
        assert.match(u, /^al\d{4}$/);
    });

    test("throws when maxLength < 6", () => {
        assert.throws(
            () => getUsername({ seed: 1, maxLength: 5 }),
            /maxLength must be at least 6/,
        );
        assert.throws(
            () => getUsername({ seed: 1, maxLength: 0 }),
            /maxLength must be at least 6/,
        );
    });

    test("gender forwards to internal first-name generation", () => {
        const m = getUsername({ seed: 1, gender: "male" });
        const f = getUsername({ seed: 1, gender: "female" });
        assert.notEqual(m, f);
    });

    test("explicit firstName wins over gender", () => {
        const u = getUsername({ seed: 1, gender: "female", firstName: "Mehmet", lastName: "Yilmaz" });
        assert.ok(u.startsWith("mehmetyilma"));
    });

    test("no parameters call works", () => {
        const u = getUsername();
        assert.match(u, /^[a-z0-9_]{1,11}\d{4}$/);
    });
});