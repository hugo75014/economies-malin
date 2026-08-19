import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'out');
const PORT = 3000;

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let url = (req.url || '/').split('?')[0];
  if (url.endsWith('/')) url += 'index.html';

  let filePath = path.join(ROOT, url);
  if (!fs.existsSync(filePath)) {
    const withHtml = filePath + '.html';
    if (fs.existsSync(withHtml)) {
      filePath = withHtml;
    } else {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
  }

  const ext = path.extname(filePath);
  res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
  res.end(fs.readFileSync(filePath));
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT}`);
});
