import sharp from 'sharp';
import fs from 'fs';

async function processImage() {
  const inputPath = 'src/assets/images/dancing_panda_cutout_1791474490057.jpg';
  const outputPath = 'src/assets/images/panda_transparent.png';

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const totalPixels = width * height;

  // Visited array for BFS
  const visited = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let qStart = 0;
  let qEnd = 0;

  // Add all border pixels to queue if dark
  const isDark = (idx) => {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    // Luminance / max channel
    return Math.max(r, g, b) <= 38;
  };

  // Top and bottom borders
  for (let x = 0; x < width; x++) {
    const topIdx = x;
    const botIdx = (height - 1) * width + x;
    if (isDark(topIdx)) {
      visited[topIdx] = 1;
      queue[qEnd++] = topIdx;
    }
    if (isDark(botIdx)) {
      visited[botIdx] = 1;
      queue[qEnd++] = botIdx;
    }
  }

  // Left and right borders
  for (let y = 0; y < height; y++) {
    const leftIdx = y * width;
    const rightIdx = y * width + (width - 1);
    if (isDark(leftIdx) && !visited[leftIdx]) {
      visited[leftIdx] = 1;
      queue[qEnd++] = leftIdx;
    }
    if (isDark(rightIdx) && !visited[rightIdx]) {
      visited[rightIdx] = 1;
      queue[qEnd++] = rightIdx;
    }
  }

  // BFS flood fill
  const neighbors = [-1, 1, -width, width];
  while (qStart < qEnd) {
    const curr = queue[qStart++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4-way neighbors
    if (cx > 0) {
      const n = curr - 1;
      if (!visited[n] && isDark(n)) {
        visited[n] = 1;
        queue[qEnd++] = n;
      }
    }
    if (cx < width - 1) {
      const n = curr + 1;
      if (!visited[n] && isDark(n)) {
        visited[n] = 1;
        queue[qEnd++] = n;
      }
    }
    if (cy > 0) {
      const n = curr - width;
      if (!visited[n] && isDark(n)) {
        visited[n] = 1;
        queue[qEnd++] = n;
      }
    }
    if (cy < height - 1) {
      const n = curr + width;
      if (!visited[n] && isDark(n)) {
        visited[n] = 1;
        queue[qEnd++] = n;
      }
    }
  }

  // Now assign alpha:
  // Any pixel in visited is outside background => alpha = 0
  // For pixels adjacent to visited with brightness <= 50, feather alpha
  for (let i = 0; i < totalPixels; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0; // Completely transparent!
    } else {
      // Check if near background and dark, feather transition
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const maxVal = Math.max(r, g, b);
      if (maxVal < 45) {
        // Soft feather on dark boundary pixels
        data[i * 4 + 3] = Math.round(Math.max(0, Math.min(255, (maxVal - 18) / (45 - 18) * 255)));
      }
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log('Successfully generated transparent PNG at', outputPath);
}

processImage().catch(console.error);
