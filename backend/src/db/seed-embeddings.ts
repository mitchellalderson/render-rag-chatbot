import { testConnection, closePool } from './config';
import { embeddingService } from '../services/embedding.service';
import { vectorService } from '../services/vector.service';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DocumentToSeed {
  content: string;
  metadata: {
    category: string;
    topic: string;
    source: string;
    filename: string;
  };
}

/**
 * Read all markdown files from the docs directory
 */
function loadDocumentsFromMarkdown(): DocumentToSeed[] {
  const docsDir = path.resolve(__dirname, 'docs');
  const documents: DocumentToSeed[] = [];

  try {
    // Check if docs directory exists
    if (!fs.existsSync(docsDir)) {
      console.error(`❌ Docs directory not found at: ${docsDir}`);
      return documents;
    }

    // Read all files in the docs directory
    const files = fs.readdirSync(docsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    console.log(`📚 Found ${markdownFiles.length} markdown file(s) in docs directory\n`);

    for (const file of markdownFiles) {
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract title from the first heading (if exists)
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : file.replace('.md', '');

      // Remove markdown heading syntax for cleaner topic name
      const topic = title.replace(/^#+\s*/, '');

      documents.push({
        content: content.trim(),
        metadata: {
          category: 'AI Documentation',
          topic,
          source: 'markdown',
          filename: file
        }
      });
    }

    return documents;
  } catch (error: any) {
    console.error(`❌ Error reading documents from markdown: ${error.message}`);
    return documents;
  }
}

async function seedEmbeddings() {
  console.log('🌱 Starting database seeding with embeddings...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
    // Load documents from markdown files
    const documents = loadDocumentsFromMarkdown();
    
    if (documents.length === 0) {
      console.error('❌ No documents found to seed. Please add markdown files to the docs directory.');
      process.exit(1);
    }

    // Check if documents already exist
    const stats = await vectorService.getStats();
    if (stats.totalDocuments > 0) {
      console.log(`⚠️  Database already contains ${stats.totalDocuments} document(s).`);
      console.log('   Do you want to add more documents? (The script will continue in 3 seconds...)');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('🔄 Generating embeddings for documents...');
    console.log(`   Using model: ${process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small'}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      try {
        console.log(`📝 Processing document ${i + 1}/${documents.length}: ${doc.metadata.topic}`);
        
        // Generate embedding for the document content
        const embedding = await embeddingService.generateEmbedding(doc.content);
        
        // Add document with embedding to vector database
        const result = await vectorService.addDocument(
          doc.content,
          embedding,
          doc.metadata
        );
        
        console.log(`   ✅ Added document (ID: ${result.id}) - ${doc.metadata.filename}`);
        successCount++;
        
        // Small delay to avoid rate limiting
        if (i < documents.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error: any) {
        console.error(`   ❌ Failed to process document: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Seeding completed!');
    console.log(`   ✅ Successfully added: ${successCount} documents`);
    if (errorCount > 0) {
      console.log(`   ❌ Failed: ${errorCount} documents`);
    }
    
    const finalStats = await vectorService.getStats();
    console.log(`   📊 Total documents in database: ${finalStats.totalDocuments}`);
    console.log('='.repeat(60));
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    throw error;
  } finally {
    await closePool();
  }
}

if (require.main === module) {
  seedEmbeddings()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedEmbeddings };
