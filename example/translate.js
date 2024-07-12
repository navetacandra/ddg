const { translate } = require("@navetacandra/ddg");

(async () => {
  const translated = await translate(
    "when u realize u messed up ur sleeping pattern and now u gotta do the 24 hours challenge",
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
