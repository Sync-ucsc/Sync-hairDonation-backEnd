const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const ShortestPath = require('../services/shortestPath');
const shortestPath = new ShortestPath();


router.post('/calculateShortestPath', async (req, res) => {
  try {
    await shortestPath.calculateShortestPath();
    
    
  } catch (err) {
    res.status(500);
    res.send(sendResponse(undefined, false, err));
  }
});