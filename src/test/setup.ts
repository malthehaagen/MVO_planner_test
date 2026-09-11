import '@testing-library/jest-dom/vitest';

// jsdom does not implement Blob.text()/arrayBuffer(), which the app uses to
// read backup files. Browsers have supported both for years; this keeps the
// tests exercising the real code path.
if (typeof Blob !== 'undefined' && typeof Blob.prototype.text !== 'function') {
  Object.defineProperty(Blob.prototype, 'text', {
    configurable: true,
    writable: true,
    value(this: Blob) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsText(this);
      });
    },
  });
}
