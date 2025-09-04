const path = require("path");
const CopyWebPackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "/bootstrap.js", // our entry point file
  // take the above file, compile it and place the output into the location indicated below
  output: {
    path: path.resolve(__dirname, "public"), // public directory
    filename: "bootstrap.js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyWebPackPlugin({
      patterns: [
        // copy it to the public folder
        { from: "./index.html", to: "./" },
      ],
    }),
  ],
};
