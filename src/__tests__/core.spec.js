const core = require("../core");

//
//
// Mock constants
//

//
//
// Mock modules
//

jest.mock("@knowdev/log", () => {
  // eslint-disable-next-line no-shadow
  const log = {
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
    var: jest.fn(),
    tag: jest.fn(),
    untag: jest.fn(),
    with: jest.fn(() => log),
  };
  log.trace.var = jest.fn();
  log.debug.var = jest.fn();
  log.info.var = jest.fn();
  log.warn.var = jest.fn();
  log.error.var = jest.fn();
  log.fatal.var = jest.fn();
  // eslint-disable-next-line no-shadow
  const { LOG_FORMAT, LOG_LEVEL } = jest.requireActual("@knowdev/log");
  return {
    Logger: jest.fn(() => log),
    LOG_FORMAT: {
      JSON: LOG_FORMAT.JSON,
    },
    LOG_LEVEL: {
      TRACE: LOG_LEVEL.TRACE,
    },
    mockFunctions: log,
  };
});

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
  jest.resetAllMocks();
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
    expect(core.log.init).toBeFunction();
    expect(core.log.tag).toBeFunction();
    expect(core.log.var).toBeFunction();
  });
  describe("Logger", () => {
    it("Calls log.tag when init is called", () => {
      expect(core.log.tag).not.toHaveBeenCalled();
      core.log.init();
      expect(core.log.tag).toHaveBeenCalled();
    });
    it("Log.init takes and tags invoke", () => {
      expect(core.log.tag).not.toHaveBeenCalled();
      core.log.init({ invoke: "MOCK_INVOKE" });
      expect(core.log.tag).toHaveBeenCalled();
      expect(core.log.tag.mock.calls[0][0]).toBeObject();
      expect(core.log.tag.mock.calls[0][0]).toHaveProperty("invoke");
      expect(core.log.tag.mock.calls[0][0].invoke).toBe("MOCK_INVOKE");
    });
  });
});
