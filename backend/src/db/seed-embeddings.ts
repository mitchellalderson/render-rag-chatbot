import { testConnection, closePool } from './config';
import { embeddingService } from '../services/embedding.service';
import { vectorService } from '../services/vector.service';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Sample documents for seeding with embeddings
const sampleDocuments = [
  {
    content: 'Machine learning is a subset of artificial intelligence that focuses on the development of algorithms that can learn from and make predictions on data.',
    metadata: { category: 'AI', topic: 'Machine Learning', source: 'seed' }
  },
  {
    content: 'Deep learning is a type of machine learning based on artificial neural networks with representation learning. It uses multiple layers to progressively extract higher-level features from raw input.',
    metadata: { category: 'AI', topic: 'Deep Learning', source: 'seed' }
  },
  {
    content: 'Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret and manipulate human language. NLP draws from many disciplines, including computer science and computational linguistics.',
    metadata: { category: 'AI', topic: 'NLP', source: 'seed' }
  },
  {
    content: 'Computer vision is an interdisciplinary field that deals with how computers can gain high-level understanding from digital images or videos. It seeks to automate tasks that the human visual system can do.',
    metadata: { category: 'AI', topic: 'Computer Vision', source: 'seed' }
  },
  {
    content: 'Reinforcement learning is an area of machine learning concerned with how software agents ought to take actions in an environment to maximize cumulative reward. It is employed by various software and machines to find the best possible behavior or path.',
    metadata: { category: 'AI', topic: 'Reinforcement Learning', source: 'seed' }
  },
  {
    content: 'Neural networks are computing systems inspired by biological neural networks that constitute animal brains. They consist of interconnected nodes (neurons) that work together to solve specific problems.',
    metadata: { category: 'AI', topic: 'Neural Networks', source: 'seed' }
  },
  {
    content: 'Transfer learning is a machine learning method where a model developed for one task is reused as the starting point for a model on a second task. It is a popular approach in deep learning where pre-trained models are used as the starting point.',
    metadata: { category: 'AI', topic: 'Transfer Learning', source: 'seed' }
  },
  {
    content: 'Large Language Models (LLMs) are neural network models trained on massive amounts of text data. They can generate human-like text, answer questions, translate languages, and perform various natural language tasks.',
    metadata: { category: 'AI', topic: 'LLMs', source: 'seed' }
  },
  {
    content: 'Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with text generation. It retrieves relevant documents from a knowledge base and uses them to generate more accurate and contextual responses.',
    metadata: { category: 'AI', topic: 'RAG', source: 'seed' }
  },
  {
    content: 'Vector databases are specialized databases designed to store and search high-dimensional vectors efficiently. They are essential for similarity search in AI applications, enabling fast retrieval of semantically similar content.',
    metadata: { category: 'AI', topic: 'Vector Databases', source: 'seed' }
  }
];

async function seedEmbeddings() {
  console.log('🌱 Starting database seeding with embeddings...\n');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  try {
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

    for (let i = 0; i < sampleDocuments.length; i++) {
      const doc = sampleDocuments[i];
      try {
        console.log(`📝 Processing document ${i + 1}/${sampleDocuments.length}: ${doc.metadata.topic}`);
        
        // Generate embedding for the document content
        const embedding = await embeddingService.generateEmbedding(doc.content);
        
        // Add document with embedding to vector database
        const result = await vectorService.addDocument(
          doc.content,
          embedding,
          doc.metadata
        );
        
        console.log(`   ✅ Added document (ID: ${result.id})`);
        successCount++;
        
        // Small delay to avoid rate limiting
        if (i < sampleDocuments.length - 1) {
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
