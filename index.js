const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to TryInventory server');
});

app.listen(port, () => {
  console.log('Server running on port', port);
});
