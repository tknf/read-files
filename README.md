# Read File Promise

Utility for async use of FileReader API on browser.

## Usage

### Installation

with Node.js:
```bash
npm install --save @tknf-labs/read-files
# or
yarn add @tknf-labs/read-files
# or
pnpm add @tknf-labs/read-files
```

in Browser:
```html
<script src="https://unpkg.com/@tknf-labs/read-files@0.1.0/dist/index.min.js"></script>
```

### Simple example:
```js
import { readAsDataUrl } from "@tknf-labs/read-files";

document.getElementById("file-upload").addEventListener("change", (e) => {
  const files = e.target.files;
  if (!files.length) return;
  for (const file of files) {
    const result = await readAsDataUrl(file);
    console.log(result); // data:image/jpeg;base64,...
  }
});
```
