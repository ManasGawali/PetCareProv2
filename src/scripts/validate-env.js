const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '../.env.local');

console.log('🔍 Validating PetCare Pro environment setup...\n');

// Check if .env.local exists
if (!fs.existsSync(envLocalPath)) {
  console.error('❌ .env.local file not found');
  console.log('💡 Run: npm run setup-env');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envLocalPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Required environment variables
const requiredVars = [
  'REACT_APP_API_URL',
  'REACT_APP_APP_NAME'
];

const optionalVars = [
  'REACT_APP_APP_VERSION',
  'REACT_APP_ENABLE_DEV_TOOLS',
  'REACT_APP_ENABLE_API_LOGGING',
  'REACT_APP_API_TIMEOUT'
];

let allValid = true;

// Check required variables
console.log('📋 Required Environment Variables:');
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}: ${envVars[varName]}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    allValid = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}: ${envVars[varName]}`);
  } else {
    console.log(`⚪ ${varName}: Using default value`);
  }
});

// Validate API URL format
if (envVars['REACT_APP_API_URL']) {
  const apiUrl = envVars['REACT_APP_API_URL'];
  if (!apiUrl.startsWith('http')) {
    console.log(`⚠️  REACT_APP_API_URL should start with http:// or https://`);
  }
  if (!apiUrl.includes('/api')) {
    console.log(`⚠️  REACT_APP_API_URL should end with /api`);
  }
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('✅ Environment validation passed!');
  console.log('🚀 You can now run: npm start');
} else {
  console.log('❌ Environment validation failed!');
  console.log('💡 Please fix the missing variables in .env.local');
  process.exit(1);
}

console.log('='.repeat(50));