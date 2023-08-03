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
  it.todo("Exports the logger");
  it.todo("Exports a project handler");
});
