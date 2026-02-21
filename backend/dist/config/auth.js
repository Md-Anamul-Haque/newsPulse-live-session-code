"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const mongodb_1 = require("better-auth/adapters/mongodb");
const mongodb_2 = require("mongodb");
require("dotenv/config");
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/newspulse";
const client = new mongodb_2.MongoClient(mongoUri);
const db = client.db();
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, mongodb_1.mongodbAdapter)(db),
    emailAndPassword: {
        enabled: true,
    },
    // Required to trust origins for CORS
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5173"]
});
//# sourceMappingURL=auth.js.map