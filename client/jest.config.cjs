module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: [
    '@testing-library/jest-dom',
    "<rootDir>/src/setupTests.js"
  ],
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"  // Dodaj to, aby mockować pliki CSS
  }
};
