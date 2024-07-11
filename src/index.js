const { search } = require("./search");

(async () => {
  const result = await search("github", "map");
  console.log(result);
})();
