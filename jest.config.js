module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupTestFrameworkScriptFile: '<rootDir>/setupTests.ts',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js'
  ],
  transform: {
    '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
  },
  moduleNameMapper: {
    '\\.scss': 'identity-obj-proxy'
  }
};
