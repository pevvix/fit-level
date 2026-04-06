import dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';

export default async () => {
  // 1. Load the test environment variables immediately
  dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

  // 2. Run Database Migrations (The globalSetup logic)
  console.log('\n🚀 [Jest Config] Preparing SQLite test database...');
  try {
    const migrationsDir = path.resolve(process.cwd(), 'db-migrations');
    // We use execSync to block the thread until migrations are finished
    execSync(`npx dbmate -d "${migrationsDir}" --no-dump-schema up`, {
      stdio: 'inherit',
      env: process.env,
    });
    console.log('✅ [Jest Config] Migrations complete.\n');
  } catch (error) {
    console.error('❌ [Jest Config] Database setup failed:', error);
    process.exit(1);
  }

  // 3. Return the actual Jest configuration object
  return {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    testTimeout: 180000,
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
      '^(\\.\\.?/.+)\\.js$': '$1',
    },
    transform: {
      '^.+\\.ts$': [
        'ts-jest',
        {
          useESM: true,
          tsconfig: {
            sourceMap: true,
            inlineSourceMap: true,
          },
        },
      ],
    },
    testMatch: ['**/tests/**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts'],
  };
};