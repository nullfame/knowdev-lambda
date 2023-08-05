const index = require("..");
const projectHandler = require("../projectHandler.module");

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

describe("Index module", () => {
  it("Is an object", async () => {
    expect(index).toBeObject();
  });
  it("Exports project handler function", () => {
    expect(index.projectHandler).toBeFunction();
    expect(index.projectHandler).toBe(projectHandler);
  });
});
