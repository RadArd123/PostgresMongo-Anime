import fs from 'fs';
import path from 'path';
import readline from 'readline';

const transcripts = [
  'C:\\Users\\radua\\.gemini\\antigravity\\brain\\350da88f-9356-4aee-998d-22649402b02d\\.system_generated\\logs\\transcript_full.jsonl'
];

async function main() {
  const fileStream = fs.createReadStream(transcripts[0]);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.content && obj.content.includes('animeNews.types.ts')) {
        const lines = obj.content.split('\n');
        const codeLines = [];
        let isCode = false;
        for (const l of lines) {
          if (l.includes('The following code has been modified to include a line number')) {
            isCode = true;
            continue;
          }
          if (isCode) {
            if (l.includes('The above content shows the entire, complete file contents of the requested file.')) {
              break;
            }
            const match = l.match(/^\d+:\s?(.*)$/);
            if (match) {
              codeLines.push(match[1]);
            } else {
              const emptyMatch = l.match(/^\d+:$/);
              if (emptyMatch) {
                codeLines.push('');
              } else {
                console.log("NO MATCH:", l);
              }
            }
          }
        }
        console.log("FINAL LINES COUNT:", codeLines.length);
        console.log("FILE CONTENT:\n" + codeLines.join('\n'));
      }
    } catch(e) {}
  }
}
main();
