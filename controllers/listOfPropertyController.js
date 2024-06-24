//list all the properties based on property type: 


const Property = require('../models/property');

const listOfProperties = async (req, res) => {
  try {
    const {
      pageNo = 1,
      limit = 5,
      searchName = '',
      sort = 'name',
      property_type_name: propertyTypeName,
      startDate = '',
      endDate = '',
      accomodates = ''
    } = req.query;

    let differenceInDays = null;

    if (startDate || endDate) {
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Both startDate and endDate must be provided' });
      }

      const startingDate = new Date(startDate);
      const endingDate = new Date(endDate);

      if (isNaN(startingDate) || isNaN(endingDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      if (endingDate < startingDate) {
        return res.status(400).json({ error: 'endDate must be after startDate' });
      }

      const differenceInDates = Math.abs(endingDate - startingDate); // milliseconds
      differenceInDays = Math.ceil(differenceInDates / (1000 * 60 * 60 * 24));
      console.log(differenceInDays);
    }

    let query = {
      property_type: propertyTypeName,
      name: new RegExp(searchName, 'i'),
    };

    if (differenceInDays !== null) {
      query.minimum_nights_num = { $lte: differenceInDays };
      query.maximum_nights_num = { $gte: differenceInDays };
    }

    if (accomodates) {
      if (!parseInt(accomodates)) {
        return res.status(400).json({ error: 'Invalid accommodates value' });
      }
      query.accommodates = { $gte: parseInt(accomodates) };
    }

    console.log(`Query: ${JSON.stringify(query)}`);

    //count total properties: 
    const totalPropertiesResult = await Property.aggregate([
      {
        "$addFields": {
          "minimum_nights_num": { "$toInt": "$minimum_nights" },
          "maximum_nights_num": { "$toInt": "$maximum_nights" }
        }
      },
      {
        $match: query
      },
      {
        $count: "totalProperties"
      }
    ])

    const totalProperties = totalPropertiesResult.length > 0 ? totalPropertiesResult[0].totalProperties : 0;

    const totalPages = Math.ceil(totalProperties / limit);


    //properties after pagination: 
    const properties = await Property.aggregate([
      {
        "$addFields": {
          "minimum_nights_num": { "$toInt": "$minimum_nights" },
          "maximum_nights_num": { "$toInt": "$maximum_nights" }
        }
      },
      { $match: query },
      { $sort: { [sort]: 1 } },
      { $skip: (pageNo - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          name: 1,
          property_type: 1,
          maximum_nights: 1,
          minimum_nights: 1,
          accommodates: 1
        }
      }
    ]).exec();

    return res.status(200).json({
      properties,
      totalProperties,
      totalPages,
      currentPage: pageNo
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { listOfProperties };


