const express = require('express');
const { propertyTypes } = require('../controllers/propertyController');

const router = express.Router();

router.get('/property-types', propertyTypes);

module.exports = router;
