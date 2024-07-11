const { search } = require("./search");

(async () => {
  const result = await search("github", "video", true);
  console.log(result);
})();
