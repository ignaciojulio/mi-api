const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/order') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const orderNumber = JSON.parse(body).ordernumber;
      const orders = JSON.parse(fs.readFileSync('orders.json'));
      const order = orders.find(o => o.ordernumber === orderNumber);
      let answer = '';
      if (order) {
        answer = {
          answer: `${order.status}`
        };
      } else {
        answer = {
          answer: 'Order not found'
        };
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(answer));
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
