const path = require("path");

module.exports = {
  entry: "./index.js", // our entry point file
  // take the above file, compile it and place the output into the location indicated below
  output: {
    path: path.resolve(__dirname, "public"), // public directory
    filename: "index.js",
  },
  mode: "development",
};
