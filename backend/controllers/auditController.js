const { auditUrl } = require("../services/auditService");

/**
 * POST /api/audit
 *
 * Body: { url: string }
 * Success: 200 { status, responseTime, title, metaDescription, h1Count,
 *                imagesMissingAlt, wordCount }
 * Failure: delegated to the centralized error handler via next(err)
 */
async function runAudit(req, res, next) {
  try {
    const result = await auditUrl(req.auditUrl);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

module.exports = { runAudit };
