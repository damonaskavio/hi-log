// MIT License

// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const toHex = (uInt8Array: Uint8Array) =>
  [...uInt8Array].map((byte) => byte.toString(16).padStart(2, "0")).join("");

// `crypto.getRandomValues` throws an error if too much entropy is requested at once. (https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues#exceptions)
const maxEntropy = 65_536;
const uuidLength = 10;

function getRandomValues(byteLength: number) {
  const generatedBytes = new Uint8Array(byteLength);

  for (
    let totalGeneratedBytes = 0;
    totalGeneratedBytes < byteLength;
    totalGeneratedBytes += maxEntropy
  ) {
    generatedBytes.set(
      crypto.getRandomValues(
        new Uint8Array(Math.min(maxEntropy, byteLength - totalGeneratedBytes))
      ),
      totalGeneratedBytes
    );
  }

  return generatedBytes;
}

export function getUUID() {
  const byteLength = Math.ceil(uuidLength * 0.5);
  const generatedBytes = getRandomValues(byteLength);

  return toHex(generatedBytes).slice(0, uuidLength);
}
