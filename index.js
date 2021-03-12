import fs from "fs";
import path from "path";
import Benchmark from "benchmark";
import chalk from "chalk";

function readFile(file) {
  return new Promise((resolve) => {
    fs.readFile(file, "utf8", (err, data) => {
      resolve();
    });
  });
}

function readableStream(file) {
  return new Promise((resolve) => {
    const stream = fs.createReadStream(file, { encoding: "utf8" });
    stream.on("data", (data) => {
      stream.destroy();
    });
    stream.on("close", () => {
      resolve();
    });
  });
}

const bench = (file) => {
  const logs = [];
  const suite = new Benchmark.Suite(file);
  suite
    .add(
      "fs.readFile",
      (defer) => {
        readFile(file).then(() => {
          defer.resolve();
        });
      },
      { defer: true }
    )
    .add(
      "readableStream",
      (defer) => {
        readableStream(file).then(() => {
          defer.resolve();
        });
      },
      { defer: true }
    )
    .on("cycle", function (event) {
      logs.push(`${file}: ${String(event.target)}`);
    })
    .on("complete", function () {
      logs.push(
        chalk.green(
          `${file}: ${this.filter("fastest").map("name")} won 👍`
        )
      );
      logs.push(
        chalk.red(`${file}: ${this.filter("slowest").map("name")} lost 👎`)
      );
      logs.forEach(log => console.log(log));
    })
    .run({ defer: true });
};

const fp = new URL(".", import.meta.url);
fs.readdir(fp, { withFileTypes: true }, (err, dirents) => {
  if (!!err) {
    throw err;
  }
  dirents
    .filter((dirent) => /.+\.csv/.test(dirent.name))
    .forEach((dirent) => {
      bench(dirent.name);
    });
})