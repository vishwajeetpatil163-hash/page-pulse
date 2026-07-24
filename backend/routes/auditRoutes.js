const express = require("express");
const { runAudit } = require("../controllers/auditController");
const { validateAuditRequest } = require("../middleware/validateAuditRequest");

const router = express.Router();

router.post("/audit", validateAuditRequest, runAudit);

module.exports = router;
