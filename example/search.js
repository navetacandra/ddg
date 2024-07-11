const { search } = require("../src");

(async () => {
  const regularSearch = await search("duckduckgo", /*"regular"*/);
  console.log(regularSearch);

  const imageSearch = await search("duckduckgo", "image");
  console.log(imageSearch);

  const videoSearch = await search("duckduckgo", "video");
  console.log(videoSearch);

  const newsSearch = await search("duckduckgo", "news");
  console.log(newsSearch);

  const locationSearch = await search("duckduckgo", "map");
  console.log(locationSearch);
})();
