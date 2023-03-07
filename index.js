/* Importación del módulo http. */
const http = require('http');
/* Importación del módulo del sistema de archivos. */
const fs = require('fs');
/* Declarando una variable constante llamada puerto y asignándole el valor 3000. */
const port = 3000;

/* Crear un servidor que escuche las solicitudes POST en la ruta /cita. */
const server = http.createServer((req, res) => {
  /* Esta es una declaración condicional que verifica si el método de solicitud es POST y la URL de la
  solicitud es /cita. Si ambas condiciones son verdaderas, entonces se lee el cuerpo de la solicitud
  y se extrae la cédula del cuerpo. Luego, las citasAsignadas se extraen del archivo citas.json.
  Finalmente, se envía la respuesta al cliente. */
  if (req.method === 'POST' && req.url === '/cita') {
    let body = '';
    /* Escuchar eventos de datos. */
    req.on('data', chunk => {
      body += chunk.toString();
    });
    /* Esta es una función de devolución de llamada que se ejecuta cuando se completa la solicitud. */
    req.on('end', () => {
      const { cedula } = JSON.parse(body);
      const citasAsignadas = JSON.parse(fs.readFileSync('citas.json')).find(o => o.cedula === cedula)?.citasAsignadas;
      const answer = citasAsignadas
        ? { answer: `Usted tiene ${citasAsignadas.length} citas asignadas\n\n${citasAsignadas.join(", ")}` }
        : { answer: `No se encontraron citas asignadas a la cedula ${cedula}` };
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(answer));
    });
  }/* Esta es una declaración condicional que verifica si el método de solicitud es POST y la URL de la
  solicitud es /cita. Si ambas condiciones son verdaderas, se lee el cuerpo de la solicitud y se
  extrae el ID del cuerpo. Luego, las Citas asignadas se extraen del archivo citas.json.
  Finalmente, se envía la respuesta al cliente. */
  else {
    res.statusCode = 404;
    res.end();
  }
});

/* Escuchando el puerto 3000. */
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
