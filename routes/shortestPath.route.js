const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const ShortestPath = require('../services/shortestPath');
const shortestPath = new ShortestPath();


const targetsService = require('../services/targets.service');
const TargetsService = new targetsService();




router.get('/sendDriverID/:email', async (req, res) => {
  try {
    let email=req.params.email;
   

    let targets = (await TargetsService.getNotCompletedTargetById(email, { status: 'NOT_COMPLETED' }))[0];
    
    let locationArray=[];
    targets.targets.forEach(element => {
     
      if (element.status == 'NeedToDeliver'){
        
        locationArray.push(element);
      }
      
    });
    console.log(locationArray);
    shortestPath.calculateShortestPath(locationArray);

  } catch (err) {
    res.status(500);
   
  }
});


module.exports = router;