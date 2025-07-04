// Importation des packages nécessaires
const express = require('express');        // Framework web pour créer le serveur
const mongoose = require('mongoose');      // Pour communiquer avec MongoDB
const cors = require('cors');             // Pour autoriser les requêtes depuis Angular
const { v4: uuidv4 } = require('uuid');   // Pour générer des IDs uniques

// Création de l'application Express
const app = express();

// Configuration des middlewares
app.use(cors());                          // Active CORS pour toutes les routes
app.use(express.json());                  // Permet de lire le JSON des requêtes

// Suppression du middleware global de log de connexion
// Ajout d'un endpoint POST /api/login pour logger la connexion
app.post('/api/login', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.body.userAgent || req.headers['user-agent'] || '';
    const device = req.body.device || 'Unknown';
    // Récupérer la localisation via ip-api.com
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    let location = {};
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      location = await response.json();
    } catch (e) {
      location = { error: 'localisation failed' };
    }
    await mongoose.connection.db.collection('connections').insertOne({
      ip,
      location,
      device,
      userAgent,
      date: new Date()
    });
    res.status(201).json({ message: 'Connexion loggée' });
  } catch (e) {
    res.status(500).json({ message: 'Erreur lors du log de connexion' });
  }
});

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/puccabot');

// Route GET /api/foods - Récupère tous les aliments
app.get('/api/puccaInputs', async (req, res) => {
  try {
    const puccaInputs = await mongoose.connection.db.collection('puccaInputs').find({}).toArray();
    res.json(puccaInputs);                      // Renvoie les aliments en JSON
  } catch (error) {
    res.status(500).json({ message: error.message });  // En cas d'erreur
  }
});

// Route POST /api/puccaInputs - Ajoute un nouvel aliment
app.post('/api/puccaInputs', async (req, res) => {
  try {
    const newInput = req.body; // <-- Ajoute cette ligne !
    const result = await mongoose.connection.db.collection('puccaInputs').insertOne(newInput);
    res.status(201).json(newInput);         // Renvoie le nouvel aliment avec son ID
  } catch (error) {
    res.status(500).json({ message: error.message });  // En cas d'erreur
  }
});

// GET /api/puccaInputs/heure/:heure - Récupère les puccaInputs qui contiennent l'heure donnée
app.get('/api/puccaInputs/heure/:heure', async (req, res) => {
  try {
    const heure = parseInt(req.params.heure, 10);
    const puccaInputs = await mongoose.connection.db.collection('puccaInputs').find({
      heures: heure
    }).toArray();
    res.json(puccaInputs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarre le serveur sur le port 3000
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000 (accessible from all interfaces)');
});

//update/insert element in dailyfood collectio