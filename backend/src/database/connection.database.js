require('dotenv').config();
const client = require('mongodb').MongoClient;
let _db;
let _connectionReady;

module.exports = {
    initializeDb: async (callback) => {
        if (_db) {
            console.log('Database is already initialized!');
            return callback(null, _db);
        }
    
        try {
            const connection = await client.connect(process.env.MONGODB_URI);
            _db = connection.db(process.env.DB_NAME);
            _connectionReady = true;
            callback(null, _db);
        } catch (error) {
            _connectionReady = false;
            callback(error);
        }
    },
    getConnection: () => {
        if (!_db) {
            _connectionReady = false;
            throw Error('Database not initialized');
        }
    
        return _db;
    },
    connectionReady: () => {
        return _connectionReady;
    }    
};