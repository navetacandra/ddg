const { search } = require("../dist/ddg.cjs");

(async () => {
  const regularSearch = await search({ query: "duckduckgo" } /*"regular"*/);
  console.log(regularSearch);

  if (regularSearch.hasNext) {
    const nextRegularSearch = await search(
      { query: "duckduckgo", next: regularSearch.next } /*"regular"*/,
    );
    console.log(nextRegularSearch);
  }

  const imageSearch = await search({ query: "duckduckgo" }, "image");
  console.log(imageSearch);
  if (imageSearch.hasNext) {
    const imageRegularSearch = await search(
      { query: "duckduckgo", next: imageSearch.next },
      "image",
    );
    console.log(imageRegularSearch);
  }

  const videoSearch = await search({ query: "duckduckgo" }, "video");
  console.log(videoSearch);

  const newsSearch = await search({ query: "duckduckgo" }, "news");
  console.log(newsSearch);

  const locationSearch = await search({ query: "duckduckgo" }, "map");
  console.log(locationSearch);
})();
