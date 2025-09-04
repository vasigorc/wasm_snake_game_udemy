const compression = require("compression");
const express = require("express");
const path = require("path");

// declare Express server
const app = express();
// get the port from the PaaS environment (e.g. Heorku) or default to 3000
const port = process.env.PORT || 3000;

// point Express to the assets' folder
const public = path.join(__dirname, "..", "www", "public");

app.use(compression());
app.use(express.static(public));

app.get("/", (_, res) => {
  res.sendFile(public + "index.html");
});

// listen to TCP connections
app.listen(port, () => {
  console.log("Server is running");
});
