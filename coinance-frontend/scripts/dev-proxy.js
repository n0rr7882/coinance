const http = require('http');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');

dotenv.config();

const target = 'http://localhost:8000';
const proxy = httpProxy.createProxyServer();

const ALLOW_HEADERS = [
  'Authorization',
  'authorization',
  'Content-Type',
  'content-type',
]

const server = http.createServer((req, res) => {
  console.info(req.method, req.url);
  req.on('data', chunk => {
    console.log(`Data chunk available: ${chunk}`)
  })
  req.on('end', () => {
    //end of data
  })

  // CORS 우회(only for development)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS.join(','));
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  proxy.web(req, res, { target });
});

server.listen(8080, () => {
  console.log('Coinance proxy server ready!');
});