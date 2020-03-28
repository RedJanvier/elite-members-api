import { config } from 'dotenv';
import http from 'http';
const PORT = process.env.PORT || 3000;

config();

const server = http.createServer(require('./app'));

server.listen(PORT, () =>
    console.log(`server started at http://localhost:${PORT}`)
);

export default server;
