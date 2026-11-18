import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const byteLimit = 1024 * 1024;
const dimensionLimit = 1024;
const approvedByteCount = 315362;
const approvedDigest =
  "639b4bca88ba9e59a7545bc68e712e0791dda133ba27d224c8725fc2692fdf17";

type JpegDimensions = { width: number; height: number };

function readJpegDimensions(image: Buffer): JpegDimensions {
  let cursor = 2;
  while (cursor < image.length) {
    if (image[cursor++] !== 0xff) {
      throw new Error("Invalid JPEG segment marker.");
    }
    while (cursor < image.length && image[cursor] === 0xff) cursor++;
    if (cursor >= image.length) break;

    const marker = image[cursor++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0x00 || marker === 0xd8) {
      throw new Error("Unexpected marker in the JPEG header.");
    }
    if (cursor + 2 > image.length) {
      throw new Error("Truncated JPEG segment length.");
    }
    const segmentLength = image.readUInt16BE(cursor);
    if (segmentLength < 2 || cursor + segmentLength > image.length) {
      throw new Error("Invalid JPEG segment length.");
    }

    // Frame markers occupy C0-CF, except the table and extension markers.
    const isFrame = marker >= 0xc0 && marker <= 0xcf &&
      marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) {
      if (segmentLength < 8) throw new Error("Truncated JPEG frame header.");
      const height = image.readUInt16BE(cursor + 3);
      const width = image.readUInt16BE(cursor + 5);
      if (width === 0 || height === 0) {
        throw new Error("JPEG dimensions must be positive.");
      }
      return { width, height };
    }
    cursor += segmentLength;
  }
  throw new Error("JPEG frame dimensions were not found.");
}

function validateApprovedImage(image: Buffer): JpegDimensions {
  if (image.length >= byteLimit) {
    throw new Error("The image must be smaller than 1 MiB.");
  }
  if (image.length !== approvedByteCount) {
    throw new Error(`Expected ${approvedByteCount} bytes, got ${image.length}.`);
  }
  if (image[0] !== 0xff || image[1] !== 0xd8) {
    throw new Error("The image is missing its JPEG start marker.");
  }
  const digest = createHash("sha256").update(image).digest("hex");
  if (digest !== approvedDigest) {
    throw new Error("The image does not match the approved SHA-256.");
  }
  const dimensions = readJpegDimensions(image);
  if (dimensions.width > dimensionLimit || dimensions.height > dimensionLimit) {
    throw new Error(`JPEG dimensions must be at most ${dimensionLimit}x${dimensionLimit}.`);
  }
  return dimensions;
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDirectory, "entry.png");
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
const outputPath = join(outputDirectory, "entry.png");

const sourceBytes = await readFile(sourcePath);
validateApprovedImage(sourceBytes);

await mkdir(outputDirectory, { recursive: true });
await copyFile(sourcePath, outputPath);

const outputBytes = await readFile(outputPath);
if (outputBytes.length !== sourceBytes.length || !outputBytes.equals(sourceBytes)) {
  throw new Error("The output is not a byte-identical copy of the source image.");
}
const dimensions = validateApprovedImage(outputBytes);

console.log(
  `${outputPath}: ${outputBytes.length} bytes; ` +
  `JPEG ${dimensions.width}x${dimensions.height}; byte-identical copy verified.`,
);
