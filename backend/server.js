require("dotenv").config();

const { createApp } = require("./app");

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Page Pulse API listening on port ${PORT}`);
});
