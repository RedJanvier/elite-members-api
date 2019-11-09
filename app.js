const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { config } = require('dotenv');
const app = express();

config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v2/members/', require('./routes/Members'));

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not FOUND!',
        try: {
            method: 'GET',
            endpoint: 'http://localhost:3000/api/v2/members/'
        }
    });
});

module.exports = app;