const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const propertyRoutes = require('./routes/propertyRoutes');
const dbConnect = require('./config/dbConnect');
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
dbConnect();

// Routes
//app.use('/properties', propertyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
