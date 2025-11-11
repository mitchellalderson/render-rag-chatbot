"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool = exports.testConnection = exports.pool = void 0;
const pg_1 = require("pg");
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'rag_chatbot',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
exports.pool = new pg_1.Pool(poolConfig);
// Handle pool errors
exports.pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});
// Test database connection
const testConnection = async () => {
    try {
        console.log("password", poolConfig.password);
        const client = await exports.pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connection established successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};
exports.testConnection = testConnection;
// Graceful shutdown
const closePool = async () => {
    await exports.pool.end();
    console.log('Database pool closed');
};
exports.closePool = closePool;
//# sourceMappingURL=config.js.map