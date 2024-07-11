const { search } = require("./search");

(async () => {
  const result = await search("github", "image", true);
  console.log(result);
})();
