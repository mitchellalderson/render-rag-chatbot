"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupNullEmbeddings = cleanupNullEmbeddings;
const config_1 = require("./config");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from the backend directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function cleanupNullEmbeddings() {
    console.log('🧹 Starting cleanup of documents with NULL embeddings...\n');
    // Test connection first
    const connected = await (0, config_1.testConnection)();
    if (!connected) {
        console.error('Failed to connect to database. Please check your configuration.');
        process.exit(1);
    }
    try {
        // Count documents with NULL embeddings
        const countResult = await config_1.pool.query('SELECT COUNT(*) FROM documents WHERE embedding IS NULL');
        const nullCount = parseInt(countResult.rows[0].count, 10);
        if (nullCount === 0) {
            console.log('✅ No documents with NULL embeddings found. Nothing to clean up.');
            return;
        }
        console.log(`⚠️  Found ${nullCount} document(s) with NULL embeddings.`);
        console.log('   These documents will be deleted...\n');
        // Delete documents with NULL embeddings
        const deleteResult = await config_1.pool.query('DELETE FROM documents WHERE embedding IS NULL');
        const deletedCount = deleteResult.rowCount ?? 0;
        console.log(`✅ Successfully deleted ${deletedCount} document(s) with NULL embeddings.`);
    }
    catch (error) {
        console.error('❌ Cleanup failed:', error.message);
        throw error;
    }
    finally {
        await (0, config_1.closePool)();
    }
}
if (require.main === module) {
    cleanupNullEmbeddings()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=cleanup-null-embeddings.js.map