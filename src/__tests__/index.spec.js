const log = require("@knowdev/log");

const index = require("../index");

//
//
// Mock constants
//

//
//
// Mock modules
//

//
//
// Mock environment
//

const DEFAULT_ENV = process.env;
beforeEach(() => {
  process.env = { ...process.env };
});
afterEach(() => {
  process.env = DEFAULT_ENV;
});

//
//
// Run tests
//

describe("Package export", () => {
  it("Is an object", async () => {
    expect(index).toBeObject();
  });
  it("Exports the logger", () => {
    expect(index.log).toBe(log);
  });
  it.todo("Exports a project handler");
});
