const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Función para inicializar y crear la base de datos
function initializeDatabase() {
  const dbPath = path.resolve(__dirname, 'mydatabase.db');
  const db = new sqlite3.Database(dbPath);

  // Crea la tabla si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS mi_tabla (
      id INTEGER PRIMARY KEY,
      nombre TEXT,
      edad INTEGER
    )
  `);

    // db.run("INSERT INTO mi_tabla (nombre, edad) VALUES ('Diego2', 21)");
    // db.run("INSERT INTO mi_tabla (nombre, edad) VALUES ('Alondra', 20)");

  return db;
}

// Inicializa la base de datos
const db = initializeDatabase();

// Configura Express para servir archivos estáticos
app.use(express.static('assets'));

// Ruta para obtener datos desde la base de datos
app.get('/api/data', (req, res) => {
  db.all('SELECT * FROM mi_tabla', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/data/:id', (req, res) => {
    const userId = req.params.id;

    // Realiza la lógica de eliminación aquí
    db.run('DELETE FROM mi_tabla WHERE id = ?', [userId], (err) => {
        if (err) {
            // Maneja el error y envía la respuesta de error
            res.status(500).json({ error: err.message });
            return;
        }

        // Envía la respuesta exitosa
        res.json({ message: `Usuario con ID ${userId} eliminado correctamente.` });
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
