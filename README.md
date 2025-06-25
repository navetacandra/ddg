# `@navetacandra/ddg` Documentation

## Introduction

`@navetacandra/ddg` is a Node.js package that provides DuckDuckGo search and translation capabilities. It supports:
- Regular web searches
- Image, video, news, and map searches
- Text translation with language auto-detection
- Paginated results for large searches

This package is:
✅ Lightweight (no external dependencies)
✅ TypeScript compatible
✅ Supports Node.js 18+ (uses native `fetch` API)

## Installation

```bash
npm install @navetacandra/ddg
```

## Usage
### Basic Import
```js
const { search, translate, languages } = require("@navetacandra/ddg");
// OR
import { search, translate, languages } from "@navetacandra/ddg";
```

### Performing Searches
#### Web Search
```js
// First page of results
const result = await search({ query: "nodejs" }, "web");
console.log(result.data); // Array of web results
console.log(result.hasNext); // true if more results available

// Next page
if (result.hasNext) {
  const nextPage = await search(
    { query: "nodejs", next: result.next },
    "web"
  );
}

// Get all pages at once
const allResults = await search({ query: "nodejs" }, "web", true);
```

#### Image Search
```js
const images = await search({ query: "cats" }, "image");
images.data.forEach(img => {
  console.log(img.title, img.imageUrl);
});

```

#### Other Search Types
```js
// Video search
const videos = await search({ query: "tutorial" }, "video");

// News search
const news = await search({ query: "technology" }, "news");

// Map search
const places = await search({ query: "coffee New York" }, "map");
```

### Translation
```js
// Detect language automatically
const detected = await translate("Hello world", "", "id");
console.log(detected); // { detected_language: 'en', text: 'Halo dunia' }

// Specify source language
const manual = await translate("Thank you", "en", "ja");
console.log(manual.text); // ありがとう

// List all supported languages
console.log(Object.entries(languages));
/*
[
  ['en', 'English'],
  ['af', 'Afrikaans'],
  ...
]
*/
```

## API Reference