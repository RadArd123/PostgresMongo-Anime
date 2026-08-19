import fs from 'fs';
import path from 'path';
import readline from 'readline';

const transcripts = [
  'C:\\Users\\radua\\.gemini\\antigravity\\brain\\77ade8ea-4ae4-4bea-85ba-26718c77b031\\.system_generated\\logs\\transcript_full.jsonl',
  'C:\\Users\\radua\\.gemini\\antigravity\\brain\\93bd979f-eec9-4a33-b6a6-7609f0a01a61\\.system_generated\\logs\\transcript_full.jsonl',
  'C:\\Users\\radua\\.gemini\\antigravity\\brain\\350da88f-9356-4aee-998d-22649402b02d\\.system_generated\\logs\\transcript_full.jsonl'
];

async function processTranscript(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'VIEW_FILE' && obj.content && obj.content.includes('File Path:')) {
        const tcResult = obj.content;
        const pathMatch = tcResult.match(/File Path: `file:\/\/\/(.+?)`/);
        if (pathMatch) {
          const fullPath = pathMatch[1].replace(/\//g, '\\').replace(/%20/g, ' ');
          
          const lines = tcResult.split('\n');
          const codeLines = [];
          let isCode = false;
          for (let l of lines) {
            l = l.replace(/\r$/, ''); // Fix the \r bug!
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
                }
              }
            }
          }
          
          if (codeLines.length > 0) {
            console.log('Restoring:', fullPath);
            fs.writeFileSync(fullPath, codeLines.join('\n'));
          }
        }
      }
    } catch (e) {
    }
  }
}

async function main() {
  for (const t of transcripts) {
    console.log('Processing', t);
    await processTranscript(t);
  }
}

main().catch(console.error);
