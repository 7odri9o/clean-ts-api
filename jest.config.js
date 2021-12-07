module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['jest-extended/all']
}
