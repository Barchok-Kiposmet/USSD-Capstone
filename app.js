const express = require('express');
const { mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cookieParser = require('cookie-parser');

require('dotenv').config();

const dataRoutes = require('./routes/data');
const ussdRoutes = require('./routes/ussd');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Setting up the session
app.use(cookieParser());
app.use(session({
    store: new MemoryStore({
        checkPeriod: 30000 // prune expired entries every 30Sec
    }),
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized:false
}))

app.use('/data', dataRoutes); 
app.use('/', ussdRoutes);

app.listen(PORT, () => {
    console.log(`My server is running on PORT ${PORT}`);
});
