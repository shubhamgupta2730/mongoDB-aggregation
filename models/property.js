
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({}, { collection: 'airbnbs' });

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
