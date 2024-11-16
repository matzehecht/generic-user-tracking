/* eslint-disable import/no-unused-modules */

module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/examples/'],
  testRegex: ['/__tests__/.*\\.(ts|tsx|js|jsx)$', '/*.test\\.(ts|tsx|js|jsx)$'],
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
};
