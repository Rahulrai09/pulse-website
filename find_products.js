const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b1b3c6b2-975b-4aaa-ba37-c8aaa4ddc194\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (line.includes('products.html') && line.includes('File Path:') && line.includes('Showing lines 1 to')) {
        console.log("Found a view_file of products.html!");
    }
  }
}

processLineByLine();
