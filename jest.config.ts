const common = {
  automock: false,
  preset: "ts-jest",
  testTimeout: 30000,
  transform: {
    "^.+\\.[t]s$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
};

export default common;
