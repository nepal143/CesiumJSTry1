require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');

// Enable CORS
app.use(cors());
app.use('/cesium', express.static(path.join(__dirname, 'node_modules', 'cesium', 'Build', 'Cesium')));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to serve the Cesium Ion API token
app.get('/cesium-token', (req, res) => {
    res.json({ token: process.env.CESIUM_ION_TOKEN }); // Return the token
});

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); 
});
