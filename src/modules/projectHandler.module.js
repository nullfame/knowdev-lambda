const { UnavailableError, UnhandledError } = require("@knowdev/errors");
const { envBoolean } = require("@knowdev/functions");
const { formatError } = require("@knowdev/http");

const { log } = require("../core");

//
//
// Function Definition
//

/**
 *
 * @param {Function} handler
 * @param {Object} options
 * @param {string} options.name
 * @returns {Function}
 */
function projectHandler(
  handler,
  {
    api = false,
    name = undefined,
    unavailable = envBoolean("PROJECT_UNAVAILABLE", { defaultValue: false }),
    // version = process.env.PROJECT_VERSION,
  } = {},
) {
  //
  //
  // Validate
  //

  if (!name) {
    // If handler has a name, use it
    if (handler.name) {
      name = handler.name; // eslint-disable-line no-param-reassign
    }
  }

  //
  //
  // Setup
  //

  return async (event, context, ...params) => {
    let response;

    try {
      log.info.var({ event });

      //
      //
      // Preprocess
      //

      // Check available
      if (unavailable) {
        log.warn(
          "Project unavailable: either PROJECT_UNAVAILABLE=true or { unavailable: true } was passed to projectHandler",
        );
        log.debug("Intentionally throwing unavailable");
        throw UnavailableError();
      }

      //
      //
      // Process
      //

      // Invoke handler
      log.trace(`Handler call {name:${name}}`);
      response = await handler(event, context, ...params);
      log.trace(`Handler exit {name:${name}}`);

      //
      //
      // Error Handling
      //
    } catch (error) {
      // if project error
      if (error.isProjectError) {
        log.trace("Caught ProjectError");
        log.var({ projectError: error });
        response = error;
      } else {
        // otherwise, respond as unhandled
        log.trace("Caught unhandled error");
        log.fatal.var({ unhandledError: error });
        response = UnhandledError();
      }
    }

    //
    //
    // Postprocess
    //

    if (api) {
      log.trace("Formatting response for API Gateway");

      // Format the project error, if there is one
      if (response.isProjectError) {
        response = formatError(response); // returns an Express response
      }

      // Convert status (part of format error) to statusCode
      if (response.status) {
        response.statusCode = response.status;
        delete response.status;
      }

      // Convert data to body
      if (response.data) {
        response.body = response.data;
        delete response.data;
      }

      // Stringify body if it is not a string
      if (typeof response.body !== "string") {
        response.body = JSON.stringify(response.body);
      }

      // TODO: Decorate headers
    }

    //
    //
    // Return
    //

    log.info.var({ response });
    return response;
  };
}

//
//
// Export
//

module.exports = projectHandler;
