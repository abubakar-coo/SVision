const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.log');

// Simple MIME type mapper
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle form POST request
  if (req.method === 'POST' && pathname === '/contact-form.php') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Parse form data (application/x-www-form-urlencoded)
        const params = new URLSearchParams(body);
        const name = params.get('name') || '';
        const email = params.get('email') || '';
        const phone = params.get('phone') || '';
        const comments = params.get('comments') || '';

        if (!name || !email) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', msg: 'Please provide your name and email.' }));
          return;
        }

        // Save submission to log file
        const timestamp = new Date().toISOString();
        const logEntry = `${timestamp} | ${name} | ${email} | ${phone} | ${comments.replace(/\n/g, ' ')}\n`;

        fs.appendFile(SUBMISSIONS_FILE, logEntry, (err) => {
          if (err) {
            console.error('Error saving submission:', err);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', msg: 'Error saving submission.' }));
            return;
          }

          console.log(`[${timestamp}] Submission saved: ${name} (${email})`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'Success',
            msg: `Congrats ${name}, your message has been received! We will get back to you as soon as possible. Thanks.`
          }));
        });
      } catch (err) {
        console.error('Error processing form:', err);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', msg: 'Error processing form.' }));
      }
    });
    return;
  }

  // Serve static files
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(__dirname, pathname);

  // Prevent directory traversal
  const realPath = path.resolve(filePath);
  if (!realPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 - Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, 'localhost', () => {
  console.log(`\n========================================`);
  console.log(`Form server running at http://localhost:${PORT}`);
  console.log(`Submissions will be saved to: ${SUBMISSIONS_FILE}`);
  console.log(`========================================\n`);
});
