const express = require("express");
const cors = require("cors");

const auditRoutes = require("./routes/auditRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();

  const allowedOrigins = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim());

  app.use(
    cors({
      origin: allowedOrigins.includes("*") ? true : allowedOrigins,
    })
  );
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "pagepulse-api" });
  });

  app.use("/api", auditRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
