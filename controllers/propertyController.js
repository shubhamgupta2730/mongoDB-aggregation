const Property = require('../models/property');

const propertyTypes = async (req, res) => {
  try {
    const propertyList = await Property.aggregate([
      {
        $group: {
          _id: "$property_type",
          totalProperties: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          property_type: "$_id",
          totalProperties: 1
        }
      }
    ]);
    res.status(200).json({
      propertyList
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = {
  propertyTypes
}