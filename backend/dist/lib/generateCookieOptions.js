"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateCookieOptions = () => {
    return ({
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use true if HTTPS
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        partitioned: process.env.NODE_ENV === 'production',
    });
};
exports.default = generateCookieOptions;
//# sourceMappingURL=generateCookieOptions.js.map