<div align="center">
<h1>Read File Promise</h1>
<p>Utility for async use of FileReader API on browser.</p>
</div>


<p align="center">
<a href="https://github.com/tknf/read-files/actions?query=branch%3Amain"><img src="https://github.com/tknf/read-files/actions/workflows/test.yaml/badge.svg?event=push&branch=main"></a>
<a href="https://twitter.com/tknf_llc" rel="nofollow"><img src="https://img.shields.io/badge/created%20by-@tknf_llc-0D58D2.svg" alt="Created by TKNF LLC"></a>
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/tknf/read-files" alt="License"></a>
<a href="https://www.npmjs.com/package/@tknf-labs/read-files" rel="nofollow"><img src="https://img.shields.io/npm/v/@tknf-labs/read-files.svg" alt="npm"></a>
<a href="https://www.npmjs.com/package/@tknf-labs/read-files" rel="nofollow"><img src="https://img.shields.io/npm/dw/@tknf-labs/read-files.svg" alt="npm"></a>
</p>

<br>
<br>

## Installation

### From `npm`

```sh
npm install --save @tknf-labs/read-files # npm
yarn add @tknf-labs/read-files           # yarn
pnpm add @tknf-labs/read-files           # pnpm
```

### in browser
```html
<script src="https://unpkg.com/@tknf-labs/read-files@0.1.0/dist/index.min.js"></script>
```

### Basic usage
```js
import { readAsDataUrl, safeReadAsDataUrl } from "@tknf-labs/read-files";

document.querySelector("input#file-upload").addEventListener("change", async (e) => {
  const files = e.target.files;
  if (!files.length) return;
  for (const file of files) {
    // reading file
    await readAsDataUrl(file); // => "data:image/jpeg;base64,..."

    // "safe" reading
    await safeReadAsDataUrl(file); // => { result: "data:image/jpeg;base64,...", error: null }
    await safeReadAsDataUrl("not file"); // => { result: null, error: DOMException }
  }
});
```

## Changelog
View the changelog at CHANGELOG.md
