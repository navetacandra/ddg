const { translate } = require("./translate");

(async () => {
  const translated = await translate("Hello, World!", "", "id");
  console.log(translated);
})();
