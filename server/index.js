const http = require('http'),
    app = require('./app/app'),
    connectDB = require('./db/db');
    
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/loan';

// Node Server..
const server = http.createServer(app);

// console.log('======', DB_URI);

// console.log('DB_URI ---- ', DB_URI);

// DB Connection and server Listeninig..
connectDB(DB_URI)
    .then(() => {
        console.log('--------- Database is connected! -------');
        // Listening to Server..
        server.listen(PORT, HOST, () => {
            console.log(`Welcome to -- ${process.env.APP_NAME} -- `);
            console.log(`Server is running on http://${HOST}:${PORT}`);
        });
    })
    .catch(error => {
        console.log('ERR! Can\'t Connected with Database! -->', error.message);
    });