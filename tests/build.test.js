import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ESM_PATH = path.join(ROOT, "dist/index.mjs");
const CJS_PATH = path.join(ROOT, "dist/index.cjs");

const buildAvailable = existsSync(ESM_PATH) && existsSync(CJS_PATH);
const skipReason = buildAvailable ? false : "build artifacts missing — run `npm run build` first";

const esm = buildAvailable ? await import(ESM_PATH) : null;
const cjsMod = buildAvailable ? await import(CJS_PATH) : null;
const cjs = cjsMod ? (cjsMod.default || cjsMod) : null;

describe("build artifacts", () => {
    test("ESM build exposes the full public API", { skip: skipReason }, () => {
        for (const fn of ["getFirstName", "getLastName", "getFullName", "getPassword", "getProfile"]) {
            assert.equal(typeof esm[fn], "function", `ESM missing ${fn}`);
        }
    });

    test("CJS build exposes the full public API", { skip: skipReason }, () => {
        for (const fn of ["getFirstName", "getLastName", "getFullName", "getPassword", "getProfile"]) {
            assert.equal(typeof cjs[fn], "function", `CJS missing ${fn}`);
        }
    });

    test("ESM and CJS produce identical seeded output", { skip: skipReason }, () => {
        for (const seed of [0, 1, 42, "abc", "x", 99999]) {
            assert.deepEqual(
                esm.getProfile({ seed }),
                cjs.getProfile({ seed }),
                `mismatch for seed=${seed}`,
            );
            assert.equal(
                esm.getPassword({ seed, length: 16, special: true }),
                cjs.getPassword({ seed, length: 16, special: true }),
            );
            assert.equal(esm.getFullName({ seed }), cjs.getFullName({ seed }));
        }
    });
});
