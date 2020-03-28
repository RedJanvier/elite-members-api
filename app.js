import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import memberRoutes from './routes/Members';
const app = express();

config();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/v2/members/', memberRoutes);

app.use((req, res, next) =>
    res.status(404).json({
        message: 'Route not FOUND!',
        try: {
            method: 'GET',
            endpoint: 'http://localhost:3000/api/v2/members/'
        }
    })
);

export default app;
