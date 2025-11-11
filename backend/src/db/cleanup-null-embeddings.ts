import { pool, testConnection, closePool } from './config';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function cleanupNullEmbeddings() {
  console.log('🧹 Starting cleanup of documents with NULL embeddings...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
    // Count documents with NULL embeddings
    const countResult = await pool.query('SELECT COUNT(*) FROM documents WHERE embedding IS NULL');
    const nullCount = parseInt(countResult.rows[0].count, 10);

    if (nullCount === 0) {
      console.log('✅ No documents with NULL embeddings found. Nothing to clean up.');
      return;
    }

    console.log(`⚠️  Found ${nullCount} document(s) with NULL embeddings.`);
    console.log('   These documents will be deleted...\n');

    // Delete documents with NULL embeddings
    const deleteResult = await pool.query('DELETE FROM documents WHERE embedding IS NULL');
    const deletedCount = deleteResult.rowCount ?? 0;

    console.log(`✅ Successfully deleted ${deletedCount} document(s) with NULL embeddings.`);
  } catch (error: any) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  } finally {
    await closePool();
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

export { cleanupNullEmbeddings };
