import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['**/*.spec.ts'],
};

export default config;
