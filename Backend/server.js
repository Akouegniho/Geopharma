const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'geopharma',
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connecté à la base de données.');
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { nom, prenom, email, password: hashedPassword };
    const query = 'INSERT INTO utilisateurs SET ?';

    db.query(query, user, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion:', err);
        res.status(500).send({ message: 'Erreur lors de l\'inscription.' });
      } else {
        res.status(200).send({ message: 'Inscription réussie!' });
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).send({ message: 'Erreur lors de l\'inscription.' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM utilisateurs WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      res.status(500).send({ message: 'Erreur lors de la connexion.' });
    } else {
      if (results.length > 0) {
        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          res.status(200).send({ message: 'Connexion réussie!' });
        } else {
          res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
        }
      } else {
        res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
      }
    }
  });
});

app.get('/api/search', (req, res) => {
  const { product } = req.query;

  const query = `
    SELECT pharmacies.nom AS pharmacie_nom, pharmacies.adresse AS pharmacie_adresse, pharmacies.telephone AS pharmacie_telephone
    FROM disponibilites
    JOIN produits ON disponibilites.produit_id = produits.idpro
    JOIN pharmacies ON disponibilites.pharmacie_id = pharmacies.idphar
    WHERE produits.nom LIKE ?
    LIMIT 10
  `;

  db.query(query, [`%${product}%`], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      res.status(500).send({ message: 'Erreur lors de la recherche.' });
    } else {
      res.status(200).send(results);
    }
  });
});
// Ajoutez ceci dans votre fichier server.js

// Route pour faire une réservation
app.post('/api/reserve', (req, res) => {
  const { userId, pharmacyId, productId } = req.body;

  const query = 'INSERT INTO reservations (user_id, pharmacy_id, product_id) VALUES (?, ?, ?)';

  db.query(query, [userId, pharmacyId, productId], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion:', err);
      res.status(500).send({ message: 'Erreur lors de la réservation.' });
    } else {
      res.status(200).send({ message: 'Réservation réussie!' });
    }
  });
});

// Route pour obtenir les détails d'une pharmacie
app.get('/api/pharmacy/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM pharmacies WHERE idphar = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      res.status(500).send({ message: 'Erreur lors de la récupération des détails de la pharmacie.' });
    } else {
      res.status(200).send(results[0]);
    }
  });
});


app.options('*', cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
