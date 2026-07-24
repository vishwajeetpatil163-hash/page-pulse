/**
 * errorHandler.js
 *
 * Express error-handling middleware (note the 4-arg signature). Any error
 * passed to next(err) anywhere in the app lands here, so no request should
 * ever crash the process or return an unhandled stack trace to the client.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Something went wrong.";

  if (statusCode >= 500) {
    // Server-side errors are worth logging; client-side ones (4xx) are not
    // noise we need in the server logs.
    console.error(`[error] ${code}:`, err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}

/**
 * Catches requests to routes that don't exist.
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `No route matches ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = { errorHandler, notFoundHandler };
