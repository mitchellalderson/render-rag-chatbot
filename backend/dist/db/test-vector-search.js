"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testVectorSearch = testVectorSearch;
const config_1 = require("./config");
const embedding_service_1 = require("../services/embedding.service");
const vector_service_1 = require("../services/vector.service");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from the backend directory
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
async function testVectorSearch() {
    console.log('🧪 Testing vector search functionality...\n');
    // Test connection first
    const connected = await (0, config_1.testConnection)();
    if (!connected) {
        console.error('Failed to connect to database. Please check your configuration.');
        process.exit(1);
    }
    try {
        const testQuery = 'What is machine learning?';
        console.log(`📝 Test query: "${testQuery}"\n`);
        // Step 1: Generate embedding for the query
        console.log('🔄 Generating embedding for query...');
        const queryEmbedding = await embedding_service_1.embeddingService.generateEmbedding(testQuery);
        console.log(`✅ Embedding generated (dimension: ${queryEmbedding.length})\n`);
        // Step 2: Search for similar documents
        console.log('🔍 Searching for similar documents...');
        const threshold = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.7');
        const maxSources = parseInt(process.env.MAX_SOURCES || '5', 10);
        console.log(`   Similarity threshold: ${threshold}`);
        console.log(`   Max sources: ${maxSources}\n`);
        const results = await vector_service_1.vectorService.search(queryEmbedding, maxSources, threshold);
        console.log(`📊 Results: Found ${results.length} documents\n`);
        if (results.length === 0) {
            console.log('⚠️  No documents found above similarity threshold!');
            console.log('   Try lowering SIMILARITY_THRESHOLD in your .env file.');
            console.log('   Current threshold:', threshold);
            // Try with lower threshold to see if documents exist
            console.log('\n🔄 Retrying with threshold 0.0...');
            const allResults = await vector_service_1.vectorService.search(queryEmbedding, 10, 0.0);
            console.log(`   Found ${allResults.length} documents with any similarity\n`);
            if (allResults.length > 0) {
                console.log('   Top results:');
                allResults.forEach((result, idx) => {
                    console.log(`   ${idx + 1}. Similarity: ${(result.similarity * 100).toFixed(2)}% - ${result.content.substring(0, 80)}...`);
                });
            }
        }
        else {
            console.log('✅ Vector search successful!\n');
            console.log('Results:');
            results.forEach((result, idx) => {
                console.log(`\n${idx + 1}. Document ID: ${result.id}`);
                console.log(`   Similarity: ${(result.similarity * 100).toFixed(2)}%`);
                console.log(`   Topic: ${result.metadata.topic || 'N/A'}`);
                console.log(`   Content: ${result.content.substring(0, 100)}...`);
            });
        }
    }
    catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
        throw error;
    }
    finally {
        await (0, config_1.closePool)();
    }
}
if (require.main === module) {
    testVectorSearch()
        .then(() => process.exit(0))
        .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-vector-search.js.map