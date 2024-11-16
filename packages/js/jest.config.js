/* eslint-disable import/no-unused-modules */

module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/examples/'],
  testRegex: ['/__tests__/.*\\.(ts|js)$', '/*.test\\.(ts|js)$'],
  transform: {
    '\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
