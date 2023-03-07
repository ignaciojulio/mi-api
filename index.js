const http = require('http');
const fs = require('fs');
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/cita') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const cedula = JSON.parse(body).cedula;
      const citas = JSON.parse(fs.readFileSync('citas.json'));
      const cita = citas.find(o => o.cedula === cedula);
      let answer = '';
      if (cita) {
        const citas = cita.citasAsignadas.map(cita => cita + " \n\n" ).join(",");
        answer = {
          answer: `Usted tiene ${cita.citasAsignadas.length} citas asignadas \n\n,${citas}`
        };
      } else {
        answer = {
          answer: `No se encontro citas asignadas a la cedula ${cedula}`
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
