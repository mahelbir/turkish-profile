import { fileURLToPath } from "url";
import path from "path";
import { readFileSync } from "fs";
import { randomInt } from "crypto";


const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const RESOURCES_DIR = path.join(DIRNAME, "../resources");

export const FILES = {
    male: path.join(RESOURCES_DIR, "male_first.csv"),
    female: path.join(RESOURCES_DIR, "female_first.csv"),
    last: path.join(RESOURCES_DIR, "all_last.csv"),
};

const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    special: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

const csvCache = new Map();

function loadCsv(filename) {
    const cached = csvCache.get(filename);
    if (cached) return cached;

    const lines = readFileSync(filename, "utf-8").split("\n");
    const entries = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        const comma = line.indexOf(",");
        if (comma === -1) continue;
        entries.push([line.slice(0, comma).trim(), parseFloat(line.slice(comma + 1))]);
    }
    csvCache.set(filename, entries);
    return entries;
}

function hashSeed(input) {
    if (typeof input === "number" && Number.isFinite(input)) {
        return Math.abs(Math.trunc(input)) >>> 0;
    }
    const str = String(input);
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
    };
}

function cryptoRandom() {
    return randomInt(0, 0x100000000) / 0x100000000;
}

export function createRng(seed) {
    if (seed === undefined || seed === null) return cryptoRandom;
    return mulberry32(hashSeed(seed));
}

function rngInt(rng, max) {
    return Math.floor(rng() * max);
}

export function pickWeighted(filename, rng) {
    const entries = loadCsv(filename);
    const r = rng();
    let lo = 0;
    let hi = entries.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (entries[mid][1] > r) hi = mid;
        else lo = mid + 1;
    }
    return entries[lo] && entries[lo][1] > r ? entries[lo][0] : "";
}

export function normalizeGender(gender, rng) {
    if (!gender) return rngInt(rng, 2) === 0 ? "female" : "male";
    if (gender !== "male" && gender !== "female") {
        throw new Error("Only 'male' and 'female' are supported as gender");
    }
    return gender;
}

export function buildUsername(rng, options) {
    if (options.maxLength < 6) {
        throw new Error("maxLength must be at least 6");
    }
    const base = (options.firstName + options.lastName)
        .replace(/[^a-zA-Z0-9]/g, () => options.replacement)
        .toLowerCase()
        .slice(0, options.maxLength - 4);
    return base + (1000 + rngInt(rng, 9000));
}

export function buildPassword(rng, options) {
    const enabled = {
        uppercase: options.uppercase,
        lowercase: options.lowercase,
        numbers: options.numbers,
        special: options.special,
    };
    const required = Object.keys(enabled).filter((k) => enabled[k]);
    if (required.length === 0) {
        throw new Error("At least one character set must be enabled");
    }
    if (options.length < required.length) {
        throw new Error(`Password length must be at least ${required.length} to include all enabled sets`);
    }

    const pool = required.map((k) => CHARSETS[k]).join("");
    const chars = new Array(options.length);

    for (let i = 0; i < required.length; i++) {
        const set = CHARSETS[required[i]];
        chars[i] = set[rngInt(rng, set.length)];
    }
    for (let i = required.length; i < options.length; i++) {
        chars[i] = pool[rngInt(rng, pool.length)];
    }
    for (let i = chars.length - 1; i > 0; i--) {
        const j = rngInt(rng, i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
}
