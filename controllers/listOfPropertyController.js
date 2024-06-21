const Property = require('../models/property');

const listOfProperties = async (req, res) => {
  try {
    const { pageNo = 1, limit = 5, searchName = '', sort = 'name', property_type_name: propertyTypeName } = req.query;

    if (!propertyTypeName) {
      return res.status(400).json({ error: 'property_type_name query parameter is required' });
    }
    
    const query = {
      property_type: propertyTypeName,
      name: new RegExp(searchName, 'i') 
    };


    const properties = await Property.find(query)
      .select('_id name property_type')
      .skip((pageNo - 1) * limit)
      .limit(limit)
      .sort(sort);

    const totalProperties = await Property.countDocuments(query);
    const totalPages = Math.ceil(totalProperties / limit);

    return res.status(200).json({
      properties,
      totalProperties,
      totalPages,
      currentPage:pageNo
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports ={ listOfProperties};
