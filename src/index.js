const { search } = require("./search");

(async () => {
  const result = await search("navetacandra", "video");
  console.log(result);
})();
