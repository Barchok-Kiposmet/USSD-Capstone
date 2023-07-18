const express = require('express');
const { mongoose } = require('mongoose');
require('dotenv').config();

const dataRoutes = require('./routes/data');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));


const app = express();
app.use(express.json());

app.use('/data', dataRoutes); 

app.listen(PORT, () => {
    console.log(`My server is running on PORT ${PORT}`);
});
