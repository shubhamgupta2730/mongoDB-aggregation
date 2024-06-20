const Property = require('../models/property');

const listOfProperties = async (req, res) => {
  try {
    const propertyTypeName = req.query.property_type_name;
    if (!propertyTypeName) { 
      return res.status(400).json({
        error: 'property_type_name query parameter is required'
      });
    }

    const properties = await Property.find({
      property_type: propertyTypeName 
    });

    return res.status(200).json({
      properties
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message
    });
  }
}

module.exports = {
  listOfProperties
}
