const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/cita', (req, res) => {
  const { cedula } = req.body;
  const citasAsignadas = JSON.parse(fs.readFileSync('citas.json')).find(o => o.cedula === cedula)?.citasAsignadas;
  const answer = citasAsignadas
        ? { answer: `Usted tiene ${citasAsignadas.length} citas asignadas\n\n${citasAsignadas.join(", ")}` }
        : { answer: `No se encontraron citas asignadas a la cedula ${cedula}` };
  res.setHeader('Content-Type', 'application/json');
  res.json(answer);
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
