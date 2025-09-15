const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '../env.local.example');
const envLocalPath = path.join(__dirname, '../.env.local');

// Check if .env.local already exists
if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local already exists');
  process.exit(0);
}

// Check if env.local.example exists
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.local.example not found');
  process.exit(1);
}

try {
  // Copy env.local.example to .env.local
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('✅ Created .env.local from env.local.example');
  console.log('📝 Please review and update the environment variables in .env.local as needed');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  process.exit(1);
}