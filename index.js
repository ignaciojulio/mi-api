const http = require('http');
const fs = require('fs');
const cors = require('cors');
const port = 3000;


const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/cita') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { cedula } = JSON.parse(body);
      const citasAsignadas = JSON.parse(fs.readFileSync('citas.json')).find(o => o.cedula === cedula)?.citasAsignadas;
      const answer = citasAsignadas
        ? { answer: `Usted tiene ${citasAsignadas.length} citas asignadas\n\n${citasAsignadas.join(", ")}` }
        : { answer: `No se encontraron citas asignadas a la cedula ${cedula}` };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(answer));
    });
  }
  else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
