const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', require('./routes/routes'));

app.use((req, res, next) => {
    res.status(404).json({ 
        message: 'Route not FOUND!', 
        try: {
            method: 'GET',
            endpoint: 'http://localhost:9000/api/'
        }
    });
});

module.exports = app;