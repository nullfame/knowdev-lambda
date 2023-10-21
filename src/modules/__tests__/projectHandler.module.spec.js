const { NotFoundError } = require("@knowdev/errors");
const HTTP = require("@knowdev/http");

const { matchers } = require("jest-json-schema");

const projectHandler = require("../projectHandler.module");

//
//
// Configuration
//

expect.extend(matchers);

const jsonApiErrorSchema = {
  type: "object",
  properties: {
    errors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          status: { type: "number" },
          title: { type: "string" },
          detail: { type: "string" },
        },
        required: ["status", "title"],
      },
    },
  },
  required: ["errors"],
};

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

let mockContext;
let mockEvent;

const DEFAULT_ENV = process.env;
beforeEach(() => {
  process.env = { ...process.env };
  mockContext = {
    context: "MOCK_CONTEXT",
  };
  mockEvent = {
    event: "MOCK_EVENT",
  };
});
afterEach(() => {
  process.env = DEFAULT_ENV;
});

//
//
// Run tests
//

describe("Project handler module", () => {
  it("Works", async () => {
    expect(projectHandler).toBeDefined();
    expect(projectHandler).toBeFunction();
  });
  it("Produces a function", () => {
    const callback = jest.fn();
    const handler = projectHandler(callback);
    expect(handler).toBeFunction();
  });
  it("Calls a function I pass it", async () => {
    const callback = jest.fn();
    const handler = projectHandler(callback);
    await handler(mockEvent, mockContext, 3, 4, 5);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(mockEvent, mockContext, 3, 4, 5);
  });
  it("Is async", async () => {
    // Arrange
    const callback = jest.fn();
    callback.mockResolvedValue("MOCK_RESULT");
    const handler = projectHandler(callback);
    // Act
    const result = await handler(mockEvent, mockContext);
    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(mockEvent, mockContext);
    expect(result).toBe("MOCK_RESULT");
  });
  describe("Error handling", () => {
    it("Will catch an unhandled thrown error", async () => {
      const mockFunction = jest.fn(() => {
        throw new Error("Sorpresa!");
      });
      const handler = projectHandler(mockFunction);
      const response = await handler(mockEvent, mockContext);
      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(response.isProjectError).toBeTrue();
      // expect(response).toMatchSchema(jsonApiErrorSchema);
      // expect(response.errors[0].status).toBe(500);
      // The response title will be "Internal Application Error" but we don't want to test that here
      // expect(response.errors[0].title).toBe("Internal Application Error");
    });
    it("Will catch a thrown ProjectError and respond with the correct status code", async () => {
      // Mock a function that throws NotFoundError
      const mockFunction = jest.fn(() => {
        throw new NotFoundError();
      });
      const handler = projectHandler(mockFunction);
      const response = await handler(mockEvent, mockContext);
      expect(response.isProjectError).toBeTrue();
      expect(response.status).toBe(404);
    });
    describe("Error avoiding", () => {
      it("Does not throw an error if context is undefined", async () => {
        const callback = jest.fn();
        const handler = projectHandler(callback);
        const response = await handler(mockEvent, undefined);
        expect(callback).toHaveBeenCalledTimes(1);
        if (response) {
          expect(response.isProjectError).not.toBeTrue();
        }
      });
    });
  });
  describe("Unavailable mode", () => {
    it("Works as normal when process.env.PROJECT_UNAVAILABLE is set to false", async () => {
      process.env.PROJECT_UNAVAILABLE = "false";
      const mockFunction = jest.fn();
      const handler = projectHandler(mockFunction);
      await handler(mockEvent, mockContext);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
    it("Will respond with a 503 if process.env.PROJECT_UNAVAILABLE is set to true", async () => {
      process.env.PROJECT_UNAVAILABLE = "true";
      const mockFunction = jest.fn();
      const handler = projectHandler(mockFunction);
      const response = await handler(mockEvent, mockContext);
      expect(response.isProjectError).toBeTrue();
      expect(response.status).toBe(HTTP.CODE.UNAVAILABLE);
      expect(mockFunction).not.toHaveBeenCalled();
    });
    it("Will respond with a 503 if unavailable=true is passed to the handler", async () => {
      const mockFunction = jest.fn();
      const handler = projectHandler(mockFunction, { unavailable: true });
      const response = await handler(mockEvent, mockContext);
      expect(response.isProjectError).toBeTrue();
      expect(response.status).toBe(HTTP.CODE.UNAVAILABLE);
      expect(mockFunction).not.toHaveBeenCalled();
    });
  });
  describe("API Gateway formatting", () => {
    it("Will catch an unhandled thrown error", async () => {
      const mockFunction = jest.fn(() => {
        throw new Error("Sorpresa!");
      });
      const handler = projectHandler(mockFunction, { api: true });
      const response = await handler(mockEvent, mockContext);
      expect(mockFunction).toHaveBeenCalledTimes(1);
      expect(response.isProjectError).toBeUndefined();
      expect(response.data).toBeUndefined();
      expect(response.body).toBeString();
      expect(JSON.parse(response.body)).toMatchSchema(jsonApiErrorSchema);
      expect(response.status).toBeUndefined();
      expect(response.statusCode).toBe(500);
    });
    it.todo("Decorates headers with project invocation");
    it.todo("Adds the project environment if it is present");
    it.todo("Does not adds the project environment if it is not present");
    it.todo("Adds the project handler if it is present");
    it.todo("Does not adds the project handler if it is not present");
    it.todo("Adds the project key if it is present");
    it.todo("Does not adds the project key if it is not present");
    it.todo("Adds the project version if it is present");
    it.todo("Does not adds the project version if it is not present");
  });
});
