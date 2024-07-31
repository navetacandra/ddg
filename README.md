# `@navetacandra/ddg` Documentation

## Introduction

`@navetacandra/ddg` is a Node.js package that provides an easy way to perform searches (regular, image, video, news, and map) and translations using DuckDuckGo. This package is designed to be lightweight and does not use any additional dependencies.

## Installation

To install the package, use npm:

```bash
npm install @navetacandra/ddg
```

## Usage

### Importing the package

```javascript
const { search, translate } = require("@navetacandra/ddg");
```

### Performing Searches

You can perform different types of searches: regular, image, video, news, and map.

#### Regular Search

```javascript
(async () => {
  const regularSearch = await search({ query: "duckduckgo" } /*'regular'*/);
  console.log(regularSearch);

  if (regularSearch.hasNext) {
    const nextRegularSearch = await search(
      { query: "duckduckgo", next: regularSearch.next } /*'regular'*/,
    );
    console.log(nextRegularSearch);
  }
})();
```

#### Regular Search with Fetch All

```javascript
(async () => {
  const regularSearch = await search({ query: "duckduckgo" }, "regular", true);
  console.log(regularSearch);
})();
```

#### Image Search

```javascript
(async () => {
  const imageSearch = await search({ query: "duckduckgo" }, "image");
  console.log(imageSearch);

  if (imageSearch.hasNext) {
    const nextImageSearch = await search(
      { query: "duckduckgo", next: imageSearch.next },
      "image",
    );
    console.log(nextImageSearch);
  }
})();
```

#### Video Search

```javascript
(async () => {
  const videoSearch = await search({ query: "duckduckgo" }, "video");
  console.log(videoSearch);
})();
```

#### News Search

```javascript
(async () => {
  const newsSearch = await search({ query: "duckduckgo" }, "news");
  console.log(newsSearch);
})();
```

#### Map Search

```javascript
(async () => {
  const locationSearch = await search({ query: "duckduckgo" }, "map");
  console.log(locationSearch);
})();
```

### Performing Translations

You can translate text from one language to another.

#### Simple Translation

```javascript
(async () => {
  const translated = await translate(
    "when u realize u messed up ur sleeping pattern and now u gotta do the 24 hours challenge",
    "en",
    "id",
  );
  console.log(translated);
})();
```

#### Translation with Auto Language Detection

```javascript
(async () => {
  const translatedWithAutoDetection = await translate(
    "saya suka nasi goreng",
    "",
    "en",
  );
  console.log(translatedWithAutoDetection);
})();
```

## API Reference

### `search(options, type, fetchAll)`

Performs a search on DuckDuckGo.

- **options**: An object with the following properties:
  - `query`: The search query (string).
  - `next`: Optional, used for paginating search results (string).
- **type**: Optional, the type of search (`'regular'`, `'image'`, `'video'`, `'news'`, `'map'`). Default is `'regular'`.
- **fetchAll**: Optional, boolean to fetch all search results at once.

**Returns**: A promise that resolves to an object with the search results. The object has the following structure:

- `results`: An array of search results.
- `hasNext`: A boolean indicating if there are more results available.
- `next`: A token for fetching the next set of results.

### `translate(text, from, to)`

Translates text from one language to another.

- **text**: The text to translate (string).
- **from**: The source language code (string). Use an empty string `''` for auto-detection.
- **to**: The target language code (string).

**Returns**: A promise that resolves to an object with the translation result. The object has the following structure:

- `translated`: The translated text (string).
- `detected_language`: The detected source language (string), if auto-detection was used. return null, if form assigned.

## Examples

See the [usage section](#usage) for detailed examples on how to use the `search` and `translate` functions.

## No Dependencies

This package is designed to be lightweight and does not rely on any additional dependencies.
