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

// NOUVEAUX ENDPOINTS POUR LE PLANNER - ajoutés à votre code existant

// GET /api/dateFrom - Récupère toutes les dates existantes pour afficher les indicateurs
app.get('/api/dateFrom', async (req, res) => {
  try {
    const existingDates = await mongoose.connection.db.collection('dateFrom').find({}).toArray();
    console.log(`📅 Récupération de ${existingDates.length} planifications existantes`);
    res.json(existingDates);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des dates:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/dateFrom - Soumission finale du formulaire
app.post('/api/dateFrom', async (req, res) => {
  try {
    const planData = {
      ...req.body,
      createdAt: new Date()
    };
    
    console.log('📝 Nouvelle planification reçue:', JSON.stringify(planData, null, 2));
    
    const result = await mongoose.connection.db.collection('dateFrom').insertOne(planData);
    console.log('✅ Planification sauvegardée avec ID:', result.insertedId);
    
    res.status(201).json({ 
      message: 'Planification créée avec succès!', 
      id: result.insertedId 
    });
  } catch (error) {
    console.error('💥 Erreur lors de la création de la planification:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/track/open/:id - Track l'ouverture d'un lien
app.post('/api/track/open/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const trackData = {
      linkId: id,
      openedAt: new Date(),
      ip: req.headers['x-forwarded-for'] || 
          req.headers['x-real-ip'] || 
          req.connection.remoteAddress || 
          req.socket.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    };
    
    console.log(`🔗 Tracking ouverture du lien ID: ${id}`);
    
    await mongoose.connection.db.collection('linkTracking').insertOne(trackData);
    
    res.status(200).json({ message: 'Ouverture trackée' });
  } catch (error) {
    console.error('❌ Erreur tracking:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/puccaLog - Log pour le choix "Dans ton coeur"
app.post('/api/puccaLog', async (req, res) => {
  try {
    const logData = {
      ...req.body,
      timestamp: new Date(),
      type: 'dans-ton-coeur'
    };
    
    console.log('💖 Log spécial "Dans ton coeur":', logData.message);
    
    await mongoose.connection.db.collection('puccaLogs').insertOne(logData);
    
    res.status(201).json({ message: 'Log enregistré' });
  } catch (error) {
    console.error('❌ Erreur log:', error);
    res.status(500).json({ message: error.message });
  }
});

// ANCIENS ENDPOINTS (conservés)

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

app.post('/api/msgToDev', async (req, res) => {
  try {
    const newInput = req.body; // <-- Ajoute cette ligne !
    const result = await mongoose.connection.db.collection('msgToDevs').insertOne(newInput);
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
      heures: { $elemMatch: { $gte: heure, $lt: heure + 1 } }    
    }).toArray();
    res.json(puccaInputs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ajout dans server.js - Endpoint pour récupérer TOUTES les voicelines
app.get('/api/puccaInputs/all', async (req, res) => {
  try {
    const allInputs = await mongoose.connection.db.collection('puccaInputs').find({}).toArray();
    console.log(`Récupération de ${allInputs.length} PuccaInputs`);
    res.json(allInputs);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint pour récupérer les messages des devs
app.get('/api/msgToDev/all', async (req, res) => {
  try {
    const allMessages = await mongoose.connection.db.collection('msgToDevs').find({}).toArray();
    console.log(`Récupération de ${allMessages.length} messages`);
    res.json(allMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint pour récupérer les logs de connexion
app.get('/api/connections/all', async (req, res) => {
  try {
    const allConnections = await mongoose.connection.db.collection('connections').find({}).toArray();
    console.log(`Récupération de ${allConnections.length} connexions`);
    res.json(allConnections);
  } catch (error) {
    console.error('Erreur lors de la récupération des connexions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Endpoint pour modifier une input
app.put('/api/puccaInputs/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedInput = req.body;
    
    // Convertir l'id en ObjectId MongoDB
    const { ObjectId } = require('mongodb');
   // si l'heures est une string on la converti en tableau de number
    if (typeof updatedInput.heures === 'string') {
      const heuresArray = updatedInput.heures.split(',').map(h => parseFloat(h.trim()));
      updatedInput.heures = heuresArray;
    }    
    const result = await mongoose.connection.db.collection('puccaInputs').updateOne(
      { _id: new ObjectId(id) },  // ⚠️ Utiliser _id avec ObjectId
      { $set: updatedInput }
    );

    console.log('✅ Résultat update:', result.matchedCount, 'trouvé(s),', result.modifiedCount, 'modifié(s)');
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Input non trouvée' });
    }
    
    res.json({ message: 'Input mise à jour avec succès' });
  } catch (error) {
    console.error('❌ Erreur update:', error);
    res.status(500).json({ message: error.message });
  }
});

//end point pour ajouter une nouvelle input
app.post('/api/puccaInputs/new', async (req, res) => {
  try {
    const newInput = req.body;
    // si l'heures est une string on la converti en tableau de number
    if (typeof newInput.heures === 'string') {
      const heuresArray = newInput.heures.split(',').map(h => parseFloat(h.trim()));
      newInput.heures = heuresArray;
    }
    await mongoose.connection.db.collection('puccaInputs').insertOne(newInput);
    res.status(201).json(newInput);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//end point pour supprimer une input
app.delete('/api/puccaInputs/:id', async (req, res) => {
  try {

    const id = req.params.id;
    const { ObjectId } = require('mongodb');
    const result = await mongoose.connection.db.collection('puccaInputs').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Input non trouvée' });
    }
    res.json({ message: 'Input supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Démarre le serveur sur le port 3000
app.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server running on port 3000 (accessible from all interfaces)');
  console.log('📋 Nouveaux endpoints disponibles:');
  console.log('   GET  /api/dateFrom - Récupère les dates existantes');
  console.log('   POST /api/dateFrom - Soumission du formulaire');
  console.log('   POST /api/track/open/:id - Track ouverture lien');
  console.log('   POST /api/puccaLog - Log choix spéciaux');
});