/* Importación del módulo http (el servidor y el cliente HTTP) que se envía con Node.js. */
const http = require('http');
/* Importación del módulo del sistema de archivos. */
const fs = require('fs');
/* Declarando una variable constante llamada puerto y asignándole el valor 3000. */
const port = 3000;

/* Creando un servidor. */
const server = http.createServer((req, res) => {
  /* El código anterior está creando un servidor que escucha un puerto y responde a una solicitud POST. */
  if (req.method === 'POST' && req.url === '/cita') {
    /* Declarar una variable llamada cuerpo y asignarle una cadena vacía. */
    let body = '';
    /* Escuchar datos y convertirlos en una cadena. */
    req.on('data', chunk => {
      body += chunk.toString();
    });
    /* El código anterior lee el cuerpo de la solicitud y lo analiza en JSON. Luego está leyendo el
    archivo citas.json y analizándolo a JSON. Luego es encontrar el objeto de cita que coincida con
    la cédula en el cuerpo de la solicitud. Luego se va creando una cadena con el número de citas y
    las propias citas. Luego está creando un objeto de respuesta con la cadena de respuesta. Luego,
    establece el tipo de contenido en JSON y envía el objeto de respuesta como respuesta. */
    req.on('end', () => {
      const cedula = JSON.parse(body).cedula;
      const citas = JSON.parse(fs.readFileSync('citas.json'));
      const cita = citas.find(o => o.cedula === cedula);
      let answer = '';
      if (cita) {
        const citas = cita.citasAsignadas.map(cita => cita + " \n\n").join(",");
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
    /* Establecer el código de estado en 404 y finalizar la respuesta. */
  } else {
    res.statusCode = 404;
    res.end();
  }
});

/* Escuchando el puerto e imprimiendo un mensaje a la consola. */
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
