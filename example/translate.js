const { translate } = require("../src");

(async () => {
  const translated = await translate("saya suka bakso", "id", "en");
  console.log(translated);

  const translatedWithAutoDetection = await translate("saya suka nasi goreng", "", "en");
  console.log(translatedWithAutoDetection);
})();
