module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/_test_/setup.ts'],
  testMatch: ['**/_test_/**/*.test.ts'],
};
