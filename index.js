const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.post('/api/usuarios', (req, res) => {
    console.log(req.body);
    res.json({ message: 'Usuario creado correctamente' });
});

app.listen(port, () => {
    console.log(`La aplicación está corriendo en el puerto ${port}`);
});
