const express = require('express');
const bp = require('body-parser');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bp.json());
app.use(cors());
app.use('/api', require('./routes/routes'));

app.listen(PORT, () => {
    console.log('api is running on http://localhost:'+ PORT);
})