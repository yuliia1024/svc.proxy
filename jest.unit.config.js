module.exports = {
  roots: ['<rootDir>/src/test/unit'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '(/test/unit/.*\\.(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};