const fs = require('fs');
const readline = require('readline');

async function extractProductsHtml() {
  const fileStream = fs.createReadStream('C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b1b3c6b2-975b-4aaa-ba37-c8aaa4ddc194\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let extracting = false;
  let fileContent = [];

  for await (const line of rl) {
    // Parse the JSON line
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' || obj.type === 'TOOL_RESPONSE' || obj.type === 'ACTION_RESPONSE' || obj.type === 'SYSTEM_RESPONSE' || obj.type === 'TOOL_CALL') {
        const text = obj.content || (obj.output ? obj.output : '');
        if (typeof text !== 'string') continue;

        if (text.includes('File Path: `file:///c:/Users/DELL/Desktop/pulse-website/products.html`') && text.includes('Showing lines 1 to')) {
            const lines = text.split('\\n');
            let capture = false;
            let currentContent = [];
            for (const l of lines) {
                if (l.startsWith('The following code has been modified')) {
                    capture = true;
                    continue;
                }
                if (l.startsWith('The above content does NOT show')) {
                    capture = false;
                    break;
                }
                if (capture) {
                    // strip line number e.g., "1: <!DOCTYPE html>" -> "<!DOCTYPE html>"
                    const match = l.match(/^\\d+:\\s(.*)$/);
                    if (match) {
                        currentContent.push(match[1]);
                    } else if (l === '') {
                        // ignore empty lines unless they have a line number, wait, empty lines might have "2: "
                        // actually, the real newline splitting in the JSON string might be literal '\n'
                    }
                }
            }
            if (currentContent.length > 0) {
                // Wait, the output string from transcript is already parsed as string, so we split by literal '\n'
                // Let's just do it again robustly.
            }
        }
      }
    } catch(e) {}
  }
}

async function extractProperly() {
    const data = fs.readFileSync('C:\\Users\\DELL\\.gemini\\antigravity\\brain\\b1b3c6b2-975b-4aaa-ba37-c8aaa4ddc194\\.system_generated\\logs\\transcript.jsonl', 'utf8');
    const lines = data.split('\\n');
    let productsContent = [];
    let longestLength = 0;
    
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const obj = JSON.parse(line);
            const content = obj.content || obj.output || '';
            if (typeof content === 'string' && content.includes('products.html') && content.includes('Showing lines 1 to')) {
                const subLines = content.split('\\n');
                let capture = false;
                let current = [];
                for (const sl of subLines) {
                    if (sl.startsWith('The following code has been modified')) {
                        capture = true;
                        continue;
                    }
                    if (sl.startsWith('The above content does NOT show') || sl.startsWith('The above content shows the entire')) {
                        capture = false;
                        break;
                    }
                    if (capture) {
                        const match = sl.match(/^\\d+:(?: (.*))?$/);
                        if (match) {
                            current.push(match[1] !== undefined ? match[1] : '');
                        }
                    }
                }
                if (current.length > longestLength) {
                    longestLength = current.length;
                    productsContent = current;
                }
            }
        } catch(e) {}
    }
    
    if (productsContent.length > 0) {
        fs.writeFileSync('products.html', productsContent.join('\\n'));
        console.log('Successfully recovered products.html with ' + productsContent.length + ' lines!');
    } else {
        console.log('Failed to extract products.html');
    }
}

extractProperly();
