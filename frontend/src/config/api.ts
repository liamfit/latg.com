// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to localhost for development
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/gigs',
  
  // Use environment variable or default to false
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
} as const;

// Helper function to get the API URL
export const getApiUrl = (): string => {
  return API_CONFIG.API_URL;
};

// Helper function to check if we should use mock data
export const shouldUseMockData = (): boolean => {
  return API_CONFIG.USE_MOCK_DATA;
}; 