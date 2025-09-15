// Environment configuration for PetCare Pro Deluxe
// This file handles environment variables in a browser-safe way

interface AppConfig {
  apiUrl: string;
  appName: string;
  appVersion: string;
  enableDevTools: boolean;
  apiTimeout: number;
  enableApiLogging: boolean;
  enableRealTime: boolean;
  enablePayments: boolean;
  enableNotifications: boolean;
}

// Helper function to safely get environment variables
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In browser, check window object for injected env vars
    return (window as any)[key] || defaultValue;
  }
  
  // In Node.js environment (SSR, build time, etc.)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  return defaultValue;
}

function getBooleanEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, defaultValue.toString());
  return value.toLowerCase() === 'true';
}

function getNumberEnvVar(key: string, defaultValue: number): number {
  const value = getEnvVar(key, defaultValue.toString());
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Export the configuration
export const config: AppConfig = {
  apiUrl: getEnvVar('REACT_APP_API_URL', 'http://localhost:3001/api'),
  appName: getEnvVar('REACT_APP_APP_NAME', 'PetCare Pro Deluxe'),
  appVersion: getEnvVar('REACT_APP_APP_VERSION', '1.0.0'),
  enableDevTools: getBooleanEnvVar('REACT_APP_ENABLE_DEV_TOOLS', true),
  apiTimeout: getNumberEnvVar('REACT_APP_API_TIMEOUT', 10000),
  enableApiLogging: getBooleanEnvVar('REACT_APP_ENABLE_API_LOGGING', true),
  enableRealTime: getBooleanEnvVar('REACT_APP_ENABLE_REAL_TIME', false),
  enablePayments: getBooleanEnvVar('REACT_APP_ENABLE_PAYMENTS', false),
  enableNotifications: getBooleanEnvVar('REACT_APP_ENABLE_NOTIFICATIONS', false),
};

// Development helpers
export const isDevelopment = getEnvVar('NODE_ENV', 'development') === 'development';
export const isProduction = getEnvVar('NODE_ENV', 'development') === 'production';

// Log configuration in development
if (isDevelopment && config.enableApiLogging) {
  console.log('🔧 PetCare Pro Configuration:', config);
}

export default config;