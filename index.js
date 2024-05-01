const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
app.use(bodyParser.json());
app.use(cors());
require("./db/db");
app.use('/api/users', userRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });