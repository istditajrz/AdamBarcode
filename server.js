const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path')

const PORT = 8000;

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "text/javascript",
  mjs: "text/javascript",
  json: "application/json",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./src");

const toBool = [() => true, () => false];

// const setCorsHeaders = (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '')
// }

const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url]
  if (url.endsWith("/")) paths.push("projects.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : `./ui/404.html`;
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

http
  .createServer(async (req, res) => {
    const file = await prepareFile(req.url);
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);