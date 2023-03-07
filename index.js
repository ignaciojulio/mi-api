/* Importación del módulo http. */
const http = require('http');
/* Importación del módulo del sistema de archivos. */
const fs = require('fs');
/* Un middleware que le permite realizar solicitudes desde un dominio diferente. */
const cors = require('cors');
/* Declarando una variable constante llamada puerto y asignándole el valor 3000. */
const port = 3000;


/* Creando un servidor. */
const server = http.createServer((req, res) => {
  /* Una declaración condicional que comprueba si el método de solicitud es POST y la URL de la
  solicitud es /cita. Si es cierto, ejecutará el código dentro del bloque. */
  if (req.method === 'POST' && req.url === '/cita') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { cedula } = JSON.parse(body);
      const citasAsignadas = JSON.parse(fs.readFileSync('citas.json')).find(o => o.cedula === cedula)?.citasAsignadas;
      const answer = citasAsignadas
        ? { answer: `Usted tiene ${citasAsignadas.length} citas asignadas\n${citasAsignadas.join(".\n")}` }
        : { answer: `No se encontraron citas asignadas a la cedula ${cedula}` };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(answer));
    });
  } /* Una respuesta predeterminada para cualquier solicitud que no sea una solicitud POST al punto final
  /cita. */
  else {
    res.statusCode = 404;
    res.end();
  }
});

/* Escuchando el puerto 3000. */
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
