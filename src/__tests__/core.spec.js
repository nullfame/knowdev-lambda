const core = require("../core");

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

describe("Core", () => {
  it("Is an object", () => {
    expect(core).toBeObject();
  });
  it("Exports the logger", () => {
    expect(core).toHaveProperty("log");
    expect(core.log).toBeObject();
    expect(core.log.var).toBeFunction();
  });
});
