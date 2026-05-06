import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadNameSet(rel) {
    return new Set(
        readFileSync(path.join(ROOT, rel), "utf-8")
            .split("\n")
            .slice(1)
            .map((l) => l.split(",")[0].trim())
            .filter(Boolean),
    );
}

export const NAMES = {
    male: loadNameSet("resources/male_first.csv"),
    female: loadNameSet("resources/female_first.csv"),
    last: loadNameSet("resources/all_last.csv"),
};

export { ROOT };
