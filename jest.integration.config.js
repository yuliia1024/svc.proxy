module.exports = {
  roots: ['<rootDir>/src/test/integration'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/test/integration/.*\\.(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};