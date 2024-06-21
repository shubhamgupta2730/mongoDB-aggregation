const express = require('express');
const { propertyTypes } = require('../controllers/propertyController');
const { listOfProperties } = require('../controllers/listOfPropertyController');


const router = express.Router();


//route for getting property types with their count: 
router.get('/property-types', propertyTypes);


//router for getting all the property list based on given property name: 
router.get('/listOfProperties', listOfProperties);



module.exports = router;
