import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getProfile } from "../src/index.js";
import { NAMES } from "./_helpers.js";

describe("getProfile", () => {
    test("returns object with all expected keys", () => {
        const p = getProfile();
        assert.deepEqual(
            Object.keys(p).sort(),
            ["birthdate", "firstName", "fullName", "gender", "lastName", "password", "username"].sort(),
        );
    });

    test("birthdate is a Date instance", () => {
        assert.ok(getProfile().birthdate instanceof Date);
        assert.ok(getProfile({ seed: 1 }).birthdate instanceof Date);
    });

    test("firstName, lastName, fullName, gender are non-empty strings", () => {
        const p = getProfile();
        assert.ok(p.firstName.length > 0);
        assert.ok(p.lastName.length > 0);
        assert.ok(p.fullName.length > 0);
        assert.ok(p.gender === "male" || p.gender === "female");
    });

    test("fullName equals firstName + ' ' + lastName", () => {
        for (let i = 0; i < 30; i++) {
            const p = getProfile({ seed: i });
            assert.equal(p.fullName, `${p.firstName} ${p.lastName}`);
        }
    });

    test("firstName matches gender list", () => {
        for (let i = 0; i < 50; i++) {
            const p = getProfile({ seed: i });
            const list = p.gender === "male" ? NAMES.male : NAMES.female;
            assert.ok(list.has(p.firstName), `'${p.firstName}' not in ${p.gender} list`);
        }
    });

    test("lastName always from last list", () => {
        for (let i = 0; i < 50; i++) {
            const p = getProfile({ seed: i });
            assert.ok(NAMES.last.has(p.lastName));
        }
    });

    test("explicit gender is honored", () => {
        for (let i = 0; i < 30; i++) {
            assert.equal(getProfile({ gender: "male", seed: i }).gender, "male");
            assert.equal(getProfile({ gender: "female", seed: i }).gender, "female");
        }
    });

    test("throws on invalid gender", () => {
        assert.throws(() => getProfile({ gender: "x" }), /Only 'male' and 'female'/);
    });

    test("username format: lowercase base + 4-digit suffix, total ≤ 15", () => {
        for (let i = 0; i < 30; i++) {
            const p = getProfile({ seed: i });
            assert.match(p.username, /^[a-z0-9_]{1,11}\d{4}$/);
            assert.ok(p.username.length <= 15);
        }
    });

    test("username derives from firstName+lastName lowercased and stripped", () => {
        const p = getProfile({ seed: 1 });
        const expectedBase = (p.firstName + p.lastName)
            .replace(/[^a-zA-Z0-9]/g, "_")
            .toLowerCase()
            .slice(0, 11);
        assert.ok(p.username.startsWith(expectedBase));
    });

    test("usernameOptions overrides pass through (maxLength + replacement)", () => {
        const p = getProfile({
            seed: 1,
            usernameOptions: { maxLength: 20, replacement: "." },
        });
        assert.match(p.username, /^[a-z0-9.]{1,16}\d{4}$/);
        assert.ok(p.username.length <= 20);
        assert.ok(!p.username.includes("_"));
    });

    test("password has default length 8", () => {
        for (let i = 0; i < 10; i++) {
            assert.equal(getProfile({ seed: i }).password.length, 8);
        }
    });

    test("password options pass through", () => {
        const p = getProfile({
            seed: 1,
            passwordOptions: { length: 20, special: true },
        });
        assert.equal(p.password.length, 20);
    });

    test("same seed produces identical full profile (birthdate excluded — not seeded)", () => {
        const { birthdate: ab, ...a } = getProfile({ seed: 1 });
        const { birthdate: bb, ...b } = getProfile({ seed: 1 });
        assert.deepEqual(a, b);
        assert.ok(ab instanceof Date && bb instanceof Date);
    });

    test("same seed + same overrides → identical (birthdate excluded)", () => {
        const opts = { seed: "shared", gender: "female", password: { length: 16, special: true } };
        const { birthdate: _a, ...a } = getProfile(opts);
        const { birthdate: _b, ...b } = getProfile(opts);
        assert.deepEqual(a, b);
    });

    test("different seeds produce different profiles", () => {
        const a = getProfile({ seed: 1 });
        const b = getProfile({ seed: 2 });
        assert.notDeepEqual(a, b);
    });

    test("seedless calls are non-deterministic", () => {
        const samples = new Set();
        for (let i = 0; i < 50; i++) samples.add(getProfile().password);
        assert.ok(samples.size > 40);
    });

    test("no parameters call works", () => {
        const p = getProfile();
        assert.ok(p.firstName);
        assert.ok(p.lastName);
        assert.ok(p.password);
    });

    test("password obeys profile-level seed (not its own)", () => {
        // Same profile seed → same password regardless of how password subobject is shaped
        const a = getProfile({ seed: 99, password: { length: 12 } }).password;
        const b = getProfile({ seed: 99, password: { length: 12 } }).password;
        assert.equal(a, b);
    });
});
