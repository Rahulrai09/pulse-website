const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, 'image');

let totalOriginalSize = 0;
let totalCompressedSize = 0;
let processedCount = 0;
let skippedCount = 0;

function formatSize(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

async function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        if (stat.size > 100 * 1024) {
          totalOriginalSize += stat.size;
          const tempPath = fullPath + '.tmp';
          try {
            let s = sharp(fullPath);
            if (ext === '.jpg' || ext === '.jpeg') {
              s = s.jpeg({ quality: 75 });
            } else if (ext === '.png') {
              s = s.png({ quality: 75 });
            } else if (ext === '.webp') {
              s = s.webp({ quality: 75 });
            }
            
            await s.toFile(tempPath);
            const newStat = fs.statSync(tempPath);
            totalCompressedSize += newStat.size;
            fs.renameSync(tempPath, fullPath); // Overwrite original
            processedCount++;
            console.log(`Compressed: ${fullPath.replace(dir, '')} (${(stat.size/1024).toFixed(1)}KB -> ${(newStat.size/1024).toFixed(1)}KB)`);
          } catch (e) {
            console.error(`Error processing ${fullPath}:`, e.message);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
          }
        } else {
          skippedCount++;
        }
      }
    }
  }
}

async function run() {
  console.log('Starting image compression...');
  await processDirectory(dir);
  console.log('\n--- Compression Summary ---');
  console.log(`Images processed: ${processedCount}`);
  console.log(`Images skipped (< 100KB): ${skippedCount}`);
  if (processedCount > 0) {
    console.log(`Original size: ${formatSize(totalOriginalSize)}`);
    console.log(`Compressed size: ${formatSize(totalCompressedSize)}`);
    console.log(`Total saved: ${formatSize(totalOriginalSize - totalCompressedSize)}`);
  }
}

run();
