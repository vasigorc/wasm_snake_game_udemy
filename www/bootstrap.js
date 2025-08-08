// responsible for loading of our index.js
import("./index.js").catch((e) =>
  console.error("Error importing index.js: ", e),
);
