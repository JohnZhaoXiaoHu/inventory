const config = {
  rootDir: "..",
  globals: {
    "ts-jest": {
      tsConfig: "./tsconfig.test.json"
    }
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest"
  },
  // testRegex: "(/__tests__/.*|(\\.|/)(test))\\.(js?|ts?)$",
  //testRegex: "main.test.ts",
  testMatch: [
    '**/main.test.ts'
  ],
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ]
}

module.exports = config;