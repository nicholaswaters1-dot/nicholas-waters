import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const toCrc = buf.subarray(4, 8 + len);
  const c = crc32(toCrc);
  buf.writeUInt32BE(c, 8 + len);
  return buf;
}

function generatePng(size, isMaskable = false) {
  const width = size;
  const height = size;
  const rowBytes = 1 + width * 4; // 1 filter byte + RGBA
  const rawData = Buffer.alloc(rowBytes * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.44);

  // Emerald theme #0f5132 -> rgb(15, 81, 50)
  // Gold accent #fbbf24 -> rgb(251, 191, 36)
  // White #ffffff
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: deep forest emerald #0f5132
      let r = 15;
      let g = 81;
      let b = 50;
      let a = 255;

      if (!isMaskable && dist > radius + 4) {
        // Rounded corner badge for standard icon
        const cornerDist = Math.max(Math.abs(dx), Math.abs(dy)) - (radius * 0.7);
        if (cornerDist > radius * 0.4) {
          a = 0;
        }
      }

      // Gold ring border
      if (dist >= radius - 6 && dist <= radius + 2) {
        r = 251;
        g = 191;
        b = 36;
      }

      // Inner circular badge glow
      if (dist < radius - 6 && dist > radius - 20) {
        r = 18;
        g = 94;
        b = 58;
      }

      // Draw Paw Print:
      // Central pad (slightly below center, wide rounded bean/heart)
      const padDx = dx;
      const padDy = dy - height * 0.05;
      const padDist = Math.sqrt((padDx * 1.1) ** 2 + (padDy * 1.3) ** 2);
      if (padDist < width * 0.16) {
        r = 255;
        g = 255;
        b = 255;
        a = 255;
      }

      // 4 Toe pads
      const toes = [
        { x: -width * 0.14, y: -height * 0.13, rx: width * 0.07, ry: width * 0.09 },
        { x: -width * 0.05, y: -height * 0.22, rx: width * 0.07, ry: width * 0.09 },
        { x: width * 0.05, y: -height * 0.22, rx: width * 0.07, ry: width * 0.09 },
        { x: width * 0.14, y: -height * 0.13, rx: width * 0.07, ry: width * 0.09 },
      ];

      for (const toe of toes) {
        const tdx = dx - toe.x;
        const tdy = dy - toe.y;
        const tdist = Math.sqrt((tdx / toe.rx) ** 2 + (tdy / toe.ry) ** 2);
        if (tdist <= 1.0) {
          r = 251;
          g = 191;
          b = 36; // Amber gold toes
          a = 255;
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Header
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // 8 bits per sample
  ihdr.writeUInt8(6, 9); // RGBA
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT
  const compressed = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate PWA icons
fs.writeFileSync('/public/pwa-192x192.png', generatePng(192, false));
fs.writeFileSync('/public/pwa-512x512.png', generatePng(512, false));
fs.writeFileSync('/public/pwa-maskable-512x512.png', generatePng(512, true));
fs.writeFileSync('/public/apple-touch-icon.png', generatePng(180, false));

console.log('Successfully generated high-resolution PWA and Play Store PNG icons!');
