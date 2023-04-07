require("dotenv").config();
const numCPUs = require("os").cpus().length;

function getInfo() {
  const args = process.argv.slice(2);
  const plat = process.platform;
  const version = process.version;
  const memoria = process.memoryUsage().rss;
  const exe = __dirname;
  const path = process.cwd();
  const id = process.pid;
  const info = {
    args,
    plat,
    version,
    memoria,
    exe,
    id,
    path,
    numCPUs,
  };
  return info;
}

module.exports = { getInfo };