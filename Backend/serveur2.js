const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost', // ou l'adresse IP de votre serveur MySQL
  user: 'root', // le nom d'utilisateur MySQL
  password: '', // le mot de passe MySQL
  database: 'geopharma', // le nom de la base de données
});

// Connecter à la base de données
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur est inscrit dans la base de données
  const query = 'SELECT * FROM utilisateurs WHERE email = ? AND password = ?';
  db.query(query, [email, password], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Connexion réussie!' });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
