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
  
  let count = 0;
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.content && obj.content.includes('animeNews.types.ts')) {
        count++;
        console.log("CALL", count, obj.content.substring(0, 150));
      }
    } catch(e) {}
  }
}
main();
