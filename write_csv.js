import fs from "fs";

const cols = 8;

function createRow () {
  const cells = [];
  for (let i = 0; i < cols; i++) {
    cells.push(`"${Math.random().toString(16)}"`);
  }
  return cells.join(',') + '\n';
}
const sizes = [1000, 10_000, 100_000, 1_000_000, 10_000_000];
for (const size of sizes) {
  const stream = fs.createWriteStream(`${size}.csv`);
  for (let i = 0; i < size; i++) {
    stream.write(createRow(), 'utf-8');
  }
  stream.end();
}