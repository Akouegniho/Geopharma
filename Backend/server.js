const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');




const app = express();
const port = process.env.PORT || 3000;

// Clé secrète pour le JWT
const secretKey = "mon mot secret"; // Remplace par une clé plus forte

app.use(bodyParser.json());

// Configuration des options CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Connexion à la base de données MySQL
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

// Route d'inscription
app.post('/api/signup', async (req, res) => {
  try {
    const { nom, prenom, email, password } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).send({ message: 'Données manquantes pour l\'inscription.' });
    }

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

// Variable globale pour stocker l'ID utilisateur
let globalUserId = null;

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Données manquantes pour la connexion.' });
  }

  const query = 'SELECT id, nom, prenom, email, password FROM utilisateurs WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      return res.status(500).send({ message: 'Erreur lors de la connexion.' });
    }

    if (results.length > 0) {
      const user = results[0];
      try {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

          // Stocker l'ID utilisateur dans la variable globale
          globalUserId = user.id;

          // Log des informations utilisateur
          console.log('Connexion réussie:', {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
          });

          return res.status(200).send({ message: 'Connexion réussie!', token });
        } else {
          return res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
        }
      } catch (bcryptError) {
        console.error('Erreur lors de la comparaison du mot de passe:', bcryptError);
        return res.status(500).send({ message: 'Erreur lors de la comparaison du mot de passe.' });
      }
    } else {
      return res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
    }
  });
});




// Route protégée pour récupérer les informations de l'utilisateur
app.get('/api/userinfo',  (req, res) => {
  const userId = globalUserId;

  const query = 'SELECT id, nom, prenom, email FROM utilisateurs WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des informations utilisateur:', err);
      return res.status(500).send({ message: 'Erreur lors de la récupération des informations utilisateur.' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Utilisateur non trouvé.' });
    }

    res.status(200).send(results[0]);
  });
});

// Route de recherche des pharmacies avec produits disponibles
app.get('/api/search', (req, res) => {
  const { product, latitude, longitude } = req.query;

  if (!product || !latitude || !longitude) {
    return res.status(400).send({ message: 'Paramètres manquants.' });
  }

  const query = `
    SELECT 
      pharmacies.idphar AS pharmacie_id,
      pharmacies.nom AS pharmacie_nom, 
      pharmacies.adresse AS pharmacie_adresse, 
      pharmacies.telephone AS pharmacie_telephone,
      pharmacies.latitude AS latitude,
      pharmacies.longitude AS longitude,
      produits.idpro AS produit_id,
      produits.nom AS produit_nom,
      produits.description AS produit_description,
      produits.prix AS produit_prix,
      produits.ordonnance AS produit_ordonnance, -- Colonne pour savoir si l'ordonnance est requise
      (6371 * acos(
        cos(radians(?)) * cos(radians(pharmacies.latitude)) * cos(radians(pharmacies.longitude) - radians(?)) + 
        sin(radians(?)) * sin(radians(pharmacies.latitude))
      )) AS distance
    FROM disponibilites
    JOIN produits ON disponibilites.produit_id = produits.idpro
    JOIN pharmacies ON disponibilites.pharmacie_id = pharmacies.idphar
    WHERE produits.nom LIKE ? 
      AND pharmacies.de_garde = TRUE
    ORDER BY distance
    LIMIT 10`;

  db.query(query, [latitude, longitude, latitude, `%${product}%`], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      res.status(500).send({ message: 'Erreur lors de la recherche.' });
    } else {
      res.status(200).send(results);
    }
  });
});

// Route de réservation
app.post('/api/reservation', (req, res) => {
  const { pharmacyId, productId,  unitPrice, quantity , totalPrice } = req.body;
  const userId = globalUserId;

  if (!userId || !pharmacyId || !productId || !unitPrice||!quantity || !totalPrice) {
    return res.status(400).send({ message: 'Données de réservation manquantes.' });
  }

  const reservationQuery = 'INSERT INTO reservations (user_id, pharmacy_id, product_id,unit_price, quantity, total_price) VALUES (?, ?, ?, ?,?,?)';

  db.query(reservationQuery, [userId, pharmacyId, productId, unitPrice,quantity, totalPrice], (err, result) => {
    if (err) {
      console.error('Erreur lors de la réservation:', err);
      res.status(500).send({ message: 'Erreur lors de la réservation.' });
    } else {
      const reservationId = result.insertId;
      QRCode.toDataURL(reservationId.toString(), (err, url) => {
        if (err) {
          console.error('Erreur lors de la génération du QR code:', err);
          res.status(500).send({ message: 'Erreur lors de la génération du QR code.' });
        } else {
          res.status(200).send({ message: 'Réservation réussie!', qrCode: url });
        }
      });
    }
  });
});


// Détails de la pharmacie et du produit
app.get('/api/pharmacy/:pharmacyId/product/:productId', (req, res) => {
  const { pharmacyId, productId } = req.params;

  const query = `
    SELECT 
      pharmacies.nom AS pharmacie_nom, 
      pharmacies.adresse AS pharmacie_adresse, 
      pharmacies.telephone AS pharmacie_telephone,
      pharmacies.latitude AS latitude,
      pharmacies.longitude AS longitude,
      produits.nom AS produit_nom,
      produits.description AS produit_description,
      produits.prix AS produit_prix
    FROM disponibilites
    JOIN produits ON disponibilites.produit_id = produits.idpro
    JOIN pharmacies ON disponibilites.pharmacie_id = pharmacies.idphar
    WHERE pharmacies.idphar = ? AND produits.idpro = ?`;

  db.query(query, [pharmacyId, productId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête:', err);
      res.status(500).send({ message: 'Erreur lors de la récupération des détails.' });
    } else {
      res.status(200).send(results[0]);
    }
  });
});
// Route de paiement
app.post('/api/payment', (req, res) => {
  const { pharmacyId, productId, quantity, unitPrice, totalPrice } = req.body;
  const userId = globalUserId;

  if (!userId || !pharmacyId || !productId || quantity <= 0 || unitPrice <= 0 || totalPrice <= 0 || isNaN(quantity) || isNaN(unitPrice) || isNaN(totalPrice)) {
    return res.status(400).send({ message: 'Les valeurs de quantité, de prix unitaire et de prix total doivent être positives et valides.' });
  }

  // Simuler la génération d'un code QR
  const qrCode = `QR_CODE_${userId}_${pharmacyId}_${productId}_${Date.now()}`;

  // Envoyer le code QR au frontend sans insérer les informations dans la base de données
  res.status(200).send({ message: 'Paiement réussi!', qrCode });
});


// Route pour récupérer les réservations par utilisateur
app.get('/api/reservations', (req, res) => {
  const userId = globalUserId; // ID de l'utilisateur à récupérer

  const query = `
    SELECT 
      p.idphar AS pharmacyId, 
      p.nom AS pharmacyName, 
      r.product_id AS medicationId, 
      pr.nom AS medicationName, 
      r.quantity, 
      r.reservation_date AS date
    FROM reservations r
    JOIN pharmacies p ON r.pharmacy_id = p.idphar
    JOIN produits pr ON r.product_id = pr.idpro  -- Jointure pour récupérer le nom du médicament
    WHERE r.user_id = ?
    ORDER BY p.idphar
  `;

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error.message);
      return res.status(500).json({
        message: 'Erreur lors de la récupération des réservations',
        details: error.message,
      });
    }

    // Regrouper les réservations par pharmacie
    const groupedReservations = results.reduce((acc, curr) => {
      const { pharmacyId, pharmacyName, medicationId, medicationName, quantity, date } = curr;
      const pharmacyIndex = acc.findIndex(ph => ph.pharmacyId === pharmacyId);

      const reservation = { medicationId, medicationName, quantity, date };

      if (pharmacyIndex === -1) {
        acc.push({
          pharmacyId,
          name: pharmacyName,
          reservations: [reservation],
        });
      } else {
        acc[pharmacyIndex].reservations.push(reservation);
      }

      return acc;
    }, []);

    res.json(groupedReservations);
  });
});
// Route pour récupérer les informations du profil de l'utilisateur
app.get('/api/profile/:userId', (req, res) => {
  const userId = globalUserId;

  // Requête de la base de données sans await
  db.query('SELECT nom, prenom, email FROM utilisateurs WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Envoi du profil utilisateur au client
    res.json(results[0]);
  });
});
// Route pour mettre à jour le profil de l'utilisateur
app.put('/api/profile/:userId', (req, res) => {
  const userId = globalUserId;
  const {prenom,  nom, email } = req.body;

  // Mise à jour de la base de données sans await
  db.query(
    'UPDATE utilisateurs SET prenom = ?, nom = ?, email = ? WHERE id = ?',
    [nom, prenom, email, userId],
    (error, results) => {
      if (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Envoi de la réponse indiquant la réussite de la mise à jour
      res.json({ message: 'Profil mis à jour avec succès' });
    }
  );
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
