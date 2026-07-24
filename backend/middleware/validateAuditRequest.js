const { validateUrl } = require("../utils/urlValidator");

/**
 * Validates the body of a POST /api/audit request before it reaches the
 * controller. On success, attaches the normalized URL to req.auditUrl.
 */
function validateAuditRequest(req, res, next) {
  const { url } = req.body || {};

  const result = validateUrl(url);
  if (!result.valid) {
    return res.status(400).json({
      error: {
        code: "INVALID_URL",
        message: result.reason,
      },
    });
  }

  req.auditUrl = result.url;
  next();
}

module.exports = { validateAuditRequest };
