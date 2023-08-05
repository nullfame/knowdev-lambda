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

describe("ProjectHandler module", () => {
  it("Works", async () => {
    const response = await projectHandler();
    console.log("response :>> ", response);
    expect(response).not.toBeUndefined();
  });
});
