<div align="center">
<h1>@tknf/read-files</h1>
<p>Modern, Promise-based utility for reading files in the browser using the FileReader API</p>
</div>

[![Github Workflow Status](https://img.shields.io/github/actions/workflow/status/tknf/read-files/ci.yaml?branch=main)](https://github.com/tknf/read-files/actions)
[![Github](https://img.shields.io/github/license/tknf/read-files)](https://github.com/tknf/read-files/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/@tknf/read-files)](https://www.npmjs.com/package/@tknf/read-files)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@tknf/read-files)](https://bundlephobia.com/package/@tknf/read-files)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@tknf/read-files)](https://bundlephobia.com/package/@tknf/read-files)
[![Github commit activity](https://img.shields.io/github/commit-activity/m/tknf/read-files)](https://github.com/tknf/read-files/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/tknf/read-files)](https://github.com/tknf/read-files/commits/main)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/tknf/read-files)

<br>

## ✨ Features

- 🎯 **Promise-based API** - Clean async/await syntax
- 🛡️ **Type Safety** - Full TypeScript support with comprehensive types
- 🔒 **Error Handling** - Both throwing and safe (non-throwing) variants
- 📱 **Multiple Formats** - Support for ArrayBuffer, text, binary string, and data URL
- 🎚️ **Event Callbacks** - Optional progress and lifecycle event handlers
- 🧪 **Well Tested** - 95%+ test coverage with comprehensive edge case testing
- 📦 **Zero Dependencies** - Lightweight with no external dependencies
- 🌐 **Browser Support** - Works in all modern browsers supporting FileReader API

## 📦 Installation

```bash
# npm
npm install @tknf/read-files

# yarn
yarn add @tknf/read-files

# pnpm
pnpm add @tknf/read-files
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { readAsText, readAsArrayBuffer, readAsDataUrl } from '@tknf/read-files';

// Read file as text
const file = new File(['Hello World'], 'hello.txt', { type: 'text/plain' });
const text = await readAsText(file);
console.log(text); // "Hello World"

// Read file as ArrayBuffer
const buffer = await readAsArrayBuffer(file);
console.log(buffer.byteLength); // 11

// Read file as data URL
const dataUrl = await readAsDataUrl(file);
console.log(dataUrl); // "data:text/plain;base64,SGVsbG8gV29ybGQ="
```

### Safe (Non-throwing) Variants

```typescript
import { safeReadAsText, safeReadAsArrayBuffer } from '@tknf/read-files';

// Safe reading - returns { result, error } instead of throwing
const { result, error } = await safeReadAsText(file);

if (error) {
  console.error('Failed to read file:', error.message);
} else {
  console.log('File content:', result);
}
```

## 📚 API Reference

### Reading Functions

#### `readAsText(data, options?)`
Reads a File or Blob as text with optional character encoding.

```typescript
await readAsText(file, { encoding: 'UTF-8' });
```

#### `readAsArrayBuffer(data, options?)`
Reads a File or Blob as an ArrayBuffer for binary data processing.

```typescript
await readAsArrayBuffer(file);
```

#### `readAsBinaryString(data, options?)`
Reads a File or Blob as a binary string where each byte is represented as a character.

```typescript
await readAsBinaryString(file);
```

#### `readAsDataUrl(data, options?)`
Reads a File or Blob as a data URL with embedded base64-encoded content.

```typescript
await readAsDataUrl(file);
```

### Safe Variants

All reading functions have corresponding safe variants that return `{ result, error }` instead of throwing:

- `safeReadAsText(data, options?)`
- `safeReadAsArrayBuffer(data, options?)`
- `safeReadAsBinaryString(data, options?)`
- `safeReadAsDataUrl(data, options?)`

### Options

```typescript
interface ReadFilePromiseOptions<ResultType> {
  // Optional pre-configured FileReader instance
  fileReader?: FileReader;
  
  // Event callbacks
  onLoad?(event: ProgressEvent<FileReader>, result: ResultType): void;
  onLoadStart?(event: ProgressEvent<FileReader>): void;
  onLoadEnd?(event: ProgressEvent<FileReader>, result: ResultType): void;
  onProgress?(event: ProgressEvent<FileReader>): void;
  onError?(event: ProgressEvent<FileReader>, error: DOMException): void;
}

// Extended options for text reading
interface ReadAsTextOptions extends ReadFilePromiseOptions<string> {
  encoding?: string; // Character encoding (e.g., "UTF-8", "ISO-8859-1")
}
```

### Utility Functions

#### `isString(value)`
Type guard to check if a FileReader result is a string.

```typescript
import { isString } from '@tknf/read-files';

if (isString(result)) {
  // result is definitely a string
}
```

#### `isArrayBuffer(value)`
Type guard to check if a FileReader result is an ArrayBuffer.

```typescript
import { isArrayBuffer } from '@tknf/read-files';

if (isArrayBuffer(result)) {
  // result is definitely an ArrayBuffer
}
```

## 💡 Examples

### File Upload with Progress

```typescript
import { readAsDataUrl } from '@tknf/read-files';

const handleFileUpload = async (file: File) => {
  try {
    const dataUrl = await readAsDataUrl(file, {
      onLoadStart: () => console.log('Reading started...'),
      onProgress: (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
        }
      },
      onLoadEnd: () => console.log('Reading completed'),
    });
    
    // Use the data URL (e.g., for image preview)
    const img = document.createElement('img');
    img.src = dataUrl;
    document.body.appendChild(img);
  } catch (error) {
    console.error('Failed to read file:', error);
  }
};
```

### Processing Binary Data

```typescript
import { readAsArrayBuffer } from '@tknf/read-files';

const processBinaryFile = async (file: File) => {
  const buffer = await readAsArrayBuffer(file);
  const view = new DataView(buffer);
  
  // Read binary data
  const signature = view.getUint32(0, true);
  console.log('File signature:', signature.toString(16));
  
  // Process the binary data...
};
```

### Error Handling with Safe Variants

```typescript
import { safeReadAsText } from '@tknf/read-files';

const readFileContent = async (file: File) => {
  const { result, error } = await safeReadAsText(file, {
    encoding: 'UTF-8'
  });
  
  if (error) {
    if (error instanceof DOMException) {
      console.error('FileReader error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
  
  return result;
};
```

### Custom FileReader Configuration

```typescript
import { readAsText } from '@tknf/read-files';

// Use a pre-configured FileReader
const customReader = new FileReader();
const text = await readAsText(file, {
  fileReader: customReader,
  onError: (event, error) => {
    console.error('Custom error handler:', error);
  }
});
```

## 🛠️ Development

### Setup

```bash
git clone https://github.com/tknf/read-files.git
cd read-files
pnpm install
```

### Scripts

```bash
# Build the library
pnpm run build

# Run tests
pnpm run test

# Run tests with coverage
pnpm run test:coverage

# Lint code
pnpm run lint

# Format code
pnpm run format

# Type check
pnpm run typecheck
```

### Project Structure

```
src/
├── index.ts                   # Main exports
├── types.ts                   # TypeScript type definitions
├── utils.ts                   # Utility functions and type guards
├── read-as-text.ts            # Text reading implementation
├── read-as-array-buffer.ts    # ArrayBuffer reading implementation
├── read-as-binary-string.ts   # Binary string reading implementation
├── read-as-data-url.ts        # Data URL reading implementation
└── **/*.test.ts               # Comprehensive test suites
```

## 🔧 Requirements

- **Browser Environment**: Modern browsers with FileReader API support
- **TypeScript**: 4.5+ (if using TypeScript)
- **Node.js**: 16+ (for development)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. **Code Style**: We use Biome for formatting and linting
2. **Testing**: Maintain test coverage above 95%
3. **TypeScript**: Ensure full type safety
4. **Documentation**: Update README for any API changes

## 🙏 Acknowledgments

- Built with TypeScript and modern development tools
- Tested with Vitest and comprehensive test scenarios
- Formatted and linted with Biome
- Bundled with tsup for optimal distribution
