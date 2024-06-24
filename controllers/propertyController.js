//retrieve the list of all the property types with their count: 

//add searching by name, sorting and pagination to this. 

const Property = require('../models/property');

const propertyTypes = async (req, res) => {
  try {
    const { pageNo = 1, limit = 5, searchName = '', sort = 'property_type' } = req.query;


    const propertyList = await Property.aggregate([
      {
        //searching the property by name field: 
        $match: {
          name: { $regex: searchName, $options: 'i' }
        }
      },
      {
        $group: {
          _id: "$property_type",
          totalProperties: { $sum: 1 },
          names: { $push: "$name" }
        }
      },
      {
        $project: {
          _id: 1,
          property_type: "$_id",
          totalProperties: 1,
          names: 1
        }
      },
      {
        $sort: {
          [sort]: 1
          //sorting in asc order.
        }
      },
      {
        $skip: (pageNo - 1) * limit
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.status(200).json({
      propertyList,
      currentPage: parseInt(pageNo),
      totalPages: Math.ceil(propertyList.length / limit),
      totalResults: propertyList.length
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

