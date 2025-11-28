"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = logInfo;
exports.logError = logError;
exports.logWarn = logWarn;
function logInfo(message) {
    console.log('[INFO]', message);
}
function logError(message) {
    console.error('[ERROR]', message);
}
function logWarn(message) {
    console.warn('[WARN]', message);
}
exports.default = { logInfo, logError, logWarn };
