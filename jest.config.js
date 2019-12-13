module.exports = {
  roots: ['./'],
  testRegex: ['./tests/index.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
}
