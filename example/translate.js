const { translate } = require("../dist/ddg.cjs");

(async () => {
  const translated = await translate(
    "meatball is delicious",
    "en",
    "id",
  );
  console.log(translated);

  const translatedWithAutoDetection = await translate(
    "saya suka nasi goreng",
    "",
    "en",
  );
  console.log(translatedWithAutoDetection);
})();
