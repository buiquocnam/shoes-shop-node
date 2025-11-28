"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureEnv = ensureEnv;
exports.sleep = sleep;
function ensureEnv(name, fallback) {
    const val = process.env[name] ?? fallback;
    if (val === undefined)
        throw new Error(`Missing env var: ${name}`);
    return val;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.default = { ensureEnv, sleep };
