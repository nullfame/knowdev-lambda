/**
 * core sets up anything needed across the library
 */

const { Logger, LOG_FORMAT, LOG_LEVEL } = require("@knowdev/log");

//
//
// Constants
//

//
//
// Logger
//

const log = new Logger({
  format: LOG_FORMAT.JSON,
  level: LOG_LEVEL.TRACE,
});

//
//
// Functions
//

function init({ invoke } = {}) {
  const tags = {};

  // Commit
  if (process.env.PROJECT_COMMIT) {
    tags.commit = process.env.PROJECT_COMMIT;
  }

  // Environment
  if (process.env.PROJECT_ENV) {
    tags.env = process.env.PROJECT_ENV;
  }

  // Invoke
  // const invoke = getCurrentInvokeUuid();
  if (invoke) {
    tags.invoke = invoke;
    // Short invoke is first 8 characters
    tags.shortInvoke = invoke.slice(0, 8);
  }

  // Project
  if (process.env.PROJECT_KEY) {
    tags.project = process.env.PROJECT_KEY;
  }

  // Version
  if (process.env.npm_package_version || process.env.PROJECT_VERSION) {
    tags.version =
      process.env.npm_package_version || process.env.PROJECT_VERSION;
  }

  return log.tag(tags); // Currently returning `undefined`
}

//
//
// Export
//

log.init = init;

module.exports = {
  log,
};
