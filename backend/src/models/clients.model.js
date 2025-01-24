const connection = require('../database/connection.database').getConnection;

const clientsModel = {};
const clientsCollection = connection().collection('clients');

/** 
 * @typedef {import('mongodb').ObjectId} ObjectId BSON ObjectId type.
 */

/**
 * Retrieves a paginated list of clients.
 * @param {Object} skipedItems Number of items to skip.
 * @param {Object} pageSize Number of items to return.
 * @returns {Promise<Array>} List of clients.
 */
clientsModel.getPaginatedClients = async (skipedItems, pageSize) => {
    const clients = await clientsCollection.find()
        .skip(skipedItems)
        .limit(pageSize)
        .toArray();
    return clients;
}

/**
 * Adds a client to the database.
 * @param {Object} client - Client object to add.
 * @returns {Promise<Object>} Result of the operation.
 */
clientsModel.addClient = async (client) => {
    const result = await clientsCollection.insertOne(client);
    return result;
}

clientsModel.getClient = async (clientId) => {
    const client = await clientsCollection.findOne({ _id: clientId });
    return client;
}

clientsModel.updateClient = async (clientId, client) => {
    const result = await clientsCollection.updateOne({ _id: clientId }, { $set: client });
    return result;
}

clientsModel.deleteClient = async (clientId) => {
    const result = await clientsCollection.deleteOne({ _id: clientId });
    return result;
}

clientsModel.checkExistingEmail = async (email) => {
    const client = await clientsCollection.findOne({ email: email });
    return client;
}

module.exports = clientsModel;