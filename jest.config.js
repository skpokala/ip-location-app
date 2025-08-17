const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/types.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost:4000',
  },
  globals: {
    'process.env': {
      NEXT_PUBLIC_IP_API_URL: 'http://ip-api.com/json',
      NEXT_PUBLIC_IP_API_FIELDS: 'query,city,country,regionName,timezone,isp,org,lat,lon',
      NEXT_PUBLIC_CORS_ORIGIN: '*',
      NEXTAUTH_URL: 'http://localhost:4000',
      NEXTAUTH_SECRET: 'test-secret-for-ci',
    },
  },
};