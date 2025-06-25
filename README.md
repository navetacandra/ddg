# `@navetacandra/ddg` Documentation

## Introduction

`@navetacandra/ddg` is a lightweight Node.js package that provides powerful and dependency-free access to DuckDuckGo's search and translation features. It supports multiple search types including web, image, video, news, and map, along with simple text translation between languages.

## Installation

Install using npm:

```bash
npm install @navetacandra/ddg
```


## Usage

### Importing the Package

```javascript
import { search, translate } from "@navetacandra/ddg";
// or in CommonJS:
// const { search, translate } = require("@navetacandra/ddg");
```

---

### Search API

Supports different categories:

- `"web"`
- `"image"`
- `"video"`
- `"news"`
- `"map"`

#### Basic Web Search

```js
const result = await search({ query: "duckduckgo" }, "web");
console.log(result);
```

#### Fetching All Pages (Pagination)

```js
const result = await search({ query: "duckduckgo" }, "web", true);
console.log(result.data.length); // all pages combined
```

#### Paginating Manually

```js
const firstPage = await search({ query: "duckduckgo" }, "image");
if (firstPage.hasNext) {
  const nextPage = await search(
    { query: "duckduckgo", next: firstPage.next },
    "image",
  );
  console.log(nextPage);
}
```

#### Other Search Types

```js
const video = await search({ query: "elon musk" }, "video");
const news = await search({ query: "global warming" }, "news");
const maps = await search({ query: "coffee near me" }, "map");
```

---

### Translate API

Translate text between two languages (by code or name). Auto-detection is supported when `from` is empty.

#### Basic Translation

```js
const result = await translate("hello world", "en", "id");
console.log(result); // { text: "halo dunia", detected_language: "en" }
```

#### Auto Language Detection

```js
const result = await translate("saya suka nasi goreng", "", "en");
console.log(result); // { text: "I like fried rice", detected_language: "id" }
```

## API Reference

### `search(query: SearchQuery, type?: SearchCategory, all?: boolean): Promise<SearchResponse<T>>`

Performs a DuckDuckGo search.

- **query**: `{ query: string, next?: string }`
- **type**: `"web" | "image" | "video" | "news" | "map"` (default: `"web"`)
- **all**: `boolean` — if `true`, recursively fetches all available pages.

Returns:

```ts
type SearchResponse<T> = {
  data: T[];
  next: string | null;
  hasNext: boolean;
};
```

### `translate(text: string, from: LanguageCode | LanguageName | "", to: LanguageCode | LanguageName): Promise<TranslateResponse>`

Translates text using DuckDuckGo's translation service.

Returns:

```ts
type TranslateResponse = {
  text: string;
  detected_language: LanguageCode | null;
};
```

### `languages`

An object that maps language codes to readable language names.

```ts
import { languages } from "@navetacandra/ddg";
console.log(languages.en); // "English"
```

---

## Examples

Check the [Usage](#usage) section above for in-depth usage examples.

---

## Notes

- No external dependencies.
- Automatically handles random user-agents and IP spoofing for basic rate-limit circumvention.
- May still be affected by DuckDuckGo's rate limits on heavy usage.

---

## License

```
MIT License

Copyright (c) 2025 navetacandra

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
````
