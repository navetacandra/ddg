const { search } = require("./search");

(async () => {
  const result = await search("navetacandra");
  console.log(result);
})();
