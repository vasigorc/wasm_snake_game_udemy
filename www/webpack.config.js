const path = require("path");
const CopyWebPackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./index.js", // our entry point file
  // take the above file, compile it and place the output into the location indicated below
  output: {
    path: path.resolve(__dirname, "public"), // public directory
    filename: "index.js",
  },
  mode: "development",
  plugins: [
    new CopyWebPackPlugin({
      patterns: [
        // copy it to the public folder
        { from: "./index.html", to: "./" },
        { from: "./sum.wasm", to: "./" },
      ],
    }),
  ],
};
