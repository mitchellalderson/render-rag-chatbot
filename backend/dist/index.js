"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const chat_1 = __importDefault(require("./routes/chat"));
const health_1 = __importDefault(require("./routes/health"));
const config_1 = require("./db/config");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/health', health_1.default);
app.use('/api/chat', chat_1.default);
// Error handling middleware (should be last)
app.use(errorHandler_1.errorHandler);
// Start server with database connection test
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await (0, config_1.testConnection)();
        if (!dbConnected) {
            console.error('⚠️  Server starting without database connection');
            console.error('   Please check your database configuration in .env');
        }
        // Start HTTP server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
        });
        // Graceful shutdown
        const shutdown = async () => {
            console.log('\n🛑 Shutting down gracefully...');
            server.close(() => {
                console.log('✅ HTTP server closed');
            });
            await (0, config_1.closePool)();
            process.exit(0);
        };
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map