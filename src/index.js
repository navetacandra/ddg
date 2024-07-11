const { search } = require("./search");

(async () => {
  const result = await search("github", "news");
  console.log(result);
})();
