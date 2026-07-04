import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getBirthdate } from "../src/index.js";

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const SLACK = 60 * 1000;

describe("getBirthdate", () => {
    test("returns a Date instance", () => {
        assert.ok(getBirthdate() instanceof Date);
        assert.ok(!Number.isNaN(getBirthdate().getTime()));
    });

    test("returns the start of the day (UTC midnight)", () => {
        for (let i = 0; i < 200; i++) {
            const d = getBirthdate();
            assert.equal(d.getUTCHours(), 0, `hours: ${d.toISOString()}`);
            assert.equal(d.getUTCMinutes(), 0, `minutes: ${d.toISOString()}`);
            assert.equal(d.getUTCSeconds(), 0, `seconds: ${d.toISOString()}`);
            assert.equal(d.getUTCMilliseconds(), 0, `ms: ${d.toISOString()}`);
        }
    });

    test("default age window is 20–50 years", () => {
        for (let i = 0; i < 200; i++) {
            const now = Date.now();
            const t = getBirthdate().getTime();
            assert.ok(t <= now - 20 * MS_PER_YEAR + SLACK, "younger than 20");
            assert.ok(t >= now - 50 * MS_PER_YEAR - SLACK, "older than 50");
        }
    });

    test("respects custom minAge/maxAge", () => {
        for (let i = 0; i < 200; i++) {
            const now = Date.now();
            const t = getBirthdate({ minAge: 30, maxAge: 40 }).getTime();
            assert.ok(t <= now - 30 * MS_PER_YEAR + SLACK);
            assert.ok(t >= now - 40 * MS_PER_YEAR - SLACK);
        }
    });

    test("minDate/maxDate bound the result exactly", () => {
        const minDate = new Date("1980-01-01T00:00:00.000Z");
        const maxDate = new Date("1990-01-01T00:00:00.000Z");
        for (let i = 0; i < 500; i++) {
            const t = getBirthdate({ minDate, maxDate }).getTime();
            assert.ok(t >= minDate.getTime());
            assert.ok(t <= maxDate.getTime());
        }
    });

    test("minDate overrides maxAge, maxDate overrides minAge", () => {
        const minDate = new Date("2000-01-01T00:00:00.000Z");
        const t = getBirthdate({ minDate, minAge: 20, maxAge: 50 }).getTime();
        assert.ok(t >= minDate.getTime());
    });

    test("degenerate range (minDate === maxDate) returns that instant", () => {
        const d = new Date("1995-06-15T00:00:00.000Z");
        assert.equal(getBirthdate({ minDate: d, maxDate: d }).getTime(), d.getTime());
    });

    test("throws when minDate/maxDate are not valid Dates", () => {
        assert.throws(() => getBirthdate({ minDate: "1980-01-01" }), /minDate must be a valid Date/);
        assert.throws(() => getBirthdate({ maxDate: 315532800000 }), /maxDate must be a valid Date/);
        assert.throws(() => getBirthdate({ minDate: new Date("nope") }), /minDate must be a valid Date/);
    });

    test("throws when range is inverted", () => {
        assert.throws(() => getBirthdate({ minAge: 50, maxAge: 20 }), /Invalid birthdate range/);
        assert.throws(
            () => getBirthdate({ minDate: new Date("2010-01-01"), maxDate: new Date("2000-01-01") }),
            /Invalid birthdate range/,
        );
    });

    test("is not seeded — successive calls differ", () => {
        const samples = new Set();
        for (let i = 0; i < 100; i++) samples.add(getBirthdate().getTime());
        assert.ok(samples.size > 90, `expected mostly unique birthdates, got ${samples.size}`);
    });
});
