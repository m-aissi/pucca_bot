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

// Ajout d'un endpoint POST /api/login pour logger la connexion
app.post('/api/login', async (req, res) => {
  try {
    // Récupération de l'IP avec plus de sources possibles
    const ip = req.headers['x-forwarded-for'] || 
               req.headers['x-real-ip'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress ||
               (req.connection.socket ? req.connection.socket.remoteAddress : null);
    
    console.log('🔍 IP détectée:', ip);
    
    const userAgent = req.body.userAgent || req.headers['user-agent'] || '';
    const device = req.body.device || 'Unknown';
    
    console.log('📱 Device:', device);
    console.log('🌐 User Agent:', userAgent);
    
    // Récupérer la localisation via ip-api.com
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
    let location = {};
    
    try {
      // Nettoyer l'IP (enlever les préfixes IPv6 si présents)
      let cleanIP = ip;
      if (ip && ip.startsWith('::ffff:')) {
        cleanIP = ip.substring(7);
      }
      
      console.log('🌍 Tentative de géolocalisation pour IP:', cleanIP);
      
      // Utiliser HTTPS au lieu de HTTP
      const geoURL = `https://ip-api.com/json/${cleanIP}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
      console.log('🔗 URL de géolocalisation:', geoURL);
      
      const response = await fetch(geoURL, {
        timeout: 5000, // Timeout de 5 secondes
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PuccaBot/1.0)'
        }
      });
      
      console.log('📡 Status de la réponse:', response.status);
      
      if (response.ok) {
        const locationData = await response.json();
        console.log('📍 Données de localisation reçues:', locationData);
        
        if (locationData.status === 'success') {
          location = {
            country: locationData.country,
            region: locationData.regionName,
            city: locationData.city,
            zip: locationData.zip,
            lat: locationData.lat,
            lon: locationData.lon,
            timezone: locationData.timezone,
            isp: locationData.isp,
            org: locationData.org,
            as: locationData.as,
            query: locationData.query
          };
          console.log('✅ Géolocalisation réussie');
        } else {
          console.log('❌ Erreur API ip-api:', locationData.message);
          location = { 
            error: 'API returned failure', 
            details: locationData.message || 'Unknown API error',
            ip: cleanIP 
          };
        }
      } else {
        console.log('❌ Erreur HTTP:', response.status, response.statusText);
        location = { 
          error: 'HTTP error', 
          details: `${response.status} ${response.statusText}`,
          ip: cleanIP 
        };
      }
    } catch (e) {
      console.error('💥 Erreur lors de la géolocalisation:', e);
      location = { 
        error: 'localisation failed', 
        details: e.message || e.toString(),
        ip: cleanIP 
      };
    }
    
    // Création de l'objet à insérer
    const connectionData = {
      ip,
      location,
      device,
      userAgent,
      date: new Date()
    };
    
    console.log('💾 Données à sauvegarder:', JSON.stringify(connectionData, null, 2));
    
    // Insertion dans la base de données
    await mongoose.connection.db.collection('connections').insertOne(connectionData);
    
    console.log('✅ Connexion sauvegardée avec succès');
    res.status(201).json({ message: 'success' });
    
  } catch (e) {
    console.error('💥 Erreur générale:', e);
    res.status(500).json({ message: 'Erreur' });
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