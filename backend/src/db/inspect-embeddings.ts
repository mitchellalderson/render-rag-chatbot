import { pool, testConnection, closePool } from './config';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function inspectEmbeddings() {
  console.log('🔍 Inspecting document embeddings...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
    // Get total count
    const totalResult = await pool.query('SELECT COUNT(*) FROM documents');
    const totalCount = parseInt(totalResult.rows[0].count, 10);
    console.log(`📊 Total documents: ${totalCount}`);

    // Count documents with NULL embeddings
    const nullResult = await pool.query('SELECT COUNT(*) FROM documents WHERE embedding IS NULL');
    const nullCount = parseInt(nullResult.rows[0].count, 10);
    console.log(`   NULL embeddings: ${nullCount}`);

    // Count documents with non-NULL embeddings
    const nonNullResult = await pool.query('SELECT COUNT(*) FROM documents WHERE embedding IS NOT NULL');
    const nonNullCount = parseInt(nonNullResult.rows[0].count, 10);
    console.log(`   Non-NULL embeddings: ${nonNullCount}\n`);

    if (nonNullCount > 0) {
      console.log('📝 Sample documents with embeddings:\n');
      
      // Get a few sample documents with their embedding info
      const sampleResult = await pool.query(`
        SELECT 
          id,
          LEFT(content, 80) as content_preview,
          metadata,
          CASE 
            WHEN embedding IS NULL THEN 'NULL'
            ELSE 'Vector (has embedding)'
          END as embedding_info
        FROM documents
        LIMIT 5
      `);

      sampleResult.rows.forEach((row, idx) => {
        console.log(`Document ${idx + 1}:`);
        console.log(`  ID: ${row.id}`);
        console.log(`  Content: ${row.content_preview}...`);
        console.log(`  Metadata: ${JSON.stringify(row.metadata)}`);
        console.log(`  Embedding: ${row.embedding_info}\n`);
      });
    }

    // Try a simple vector search to see if it works
    if (nonNullCount > 0) {
      console.log('🔍 Testing vector search functionality...\n');
      
      const testResult = await pool.query(`
        SELECT 
          id,
          LEFT(content, 60) as content_preview,
          embedding IS NOT NULL as has_embedding
        FROM documents
        WHERE embedding IS NOT NULL
        LIMIT 1
      `);

      if (testResult.rows.length > 0) {
        const testDoc = testResult.rows[0];
        console.log(`✅ Found test document with embedding: ${testDoc.id}`);
        console.log(`   Content: ${testDoc.content_preview}...\n`);
      } else {
        console.log('❌ No documents with embeddings found for testing.\n');
      }
    }

  } catch (error: any) {
    console.error('❌ Inspection failed:', error.message);
    console.error('Error details:', error);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  inspectEmbeddings()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { inspectEmbeddings };
