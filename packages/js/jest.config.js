module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/es/', '/examples/'],
  transform: {
    '\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testRegex: ['/__tests__/.*\\.(ts|js)$', '/*.test\\.(ts|js)$'],
};
