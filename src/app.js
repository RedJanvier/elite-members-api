import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import routes from './routes/index';

const app = express();
const { PORT } = process.env;

app.use(json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api/v2/', routes);

app.use((req, res) =>
  res.status(404).json({
    message: 'Route not FOUND!',
    try: {
      method: 'GET',
      endpoint: 'http://localhost:3000/api/v2/members/',
    },
  })
);

app.listen(PORT, console.log(`server started at http://localhost:${PORT}`));

export default app;
