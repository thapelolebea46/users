const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Serve HTML
  if (req.url === '/' && req.method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
  }

  // Handle user creation
  else if (req.url === '/create-user' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());

    req.on('end', () => {
      const params = new URLSearchParams(body);
      const username = params.get('username');
      const password = params.get('password');

      if (!username || !password) {
        res.writeHead(400);
        return res.end('Username and password required');
      }

      const userData = `Username: ${username}, Password: ${password}\n`;

      fs.appendFile('users.txt', userData, (err) => {
        if (err) {
          res.writeHead(500);
          return res.end('Failed to save user');
        }
        res.writeHead(200);
        res.end('User created successfully');
      });
    });
  }

  else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
