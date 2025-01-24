const bcrypt = require("bcryptjs");
const connection = require('../database/connection.database').getConnection;

const accountsModel = {};
const accoutnsCollection = connection().collection('accounts');

/** 
 * @typedef {import('mongodb').ObjectId} ObjectId BSON ObjectId type.
 */

/**
 * Add an account to the database.
 * @param {Object} account 
 * @returns {Promise<Object>} Result of the operation.
 */
accountsModel.addAccount = async (account) => {
    account.password = bcrypt.hashSync(account.password, 10);    
    const result = await accoutnsCollection.insertOne(account);
    return result;
}

/**
 * Get an account from the database.
 * @param {ObjectId} accountId 
 * @returns {Promise<Object>} Account object.
 */
accountsModel.getAccount = async (accountId) => {
    const account = await accoutnsCollection.findOne({ _id: accountId });
    return account;
}

accountsModel.getAccountByEmail = async (email) => {
    const account = await accoutnsCollection.findOne({ email: email });
    return account;
}

/**
 * Update an account in the database.
 * @param {ObjectId} accountId 
 * @param {Object} account 
 * @returns {Promise<Object>} Result of the operation.
 */
accountsModel.updateAccount = async (accountId, account) => {
    const result = await accoutnsCollection.updateOne({ _id: accountId }, { $set: account });
    return result;
}

/**
 * Delete an account from the database.
 * @param {ObjectId} accountId 
 * @returns {Promise<Object>} Result of the operation.
 */
accountsModel.deleteAccount = async (accountId) => {
    const result = await accoutnsCollection.deleteOne({ _id: accountId });
    return result;
}

/**
 * Check if an email exists in the database.
 * @param {String} email 
 * @returns {Promise<Boolean>} True if email exists; otherwise, false.
 */
accountsModel.checkExistingEmail = async (email) => {
    const account = await accoutnsCollection.findOne({ email: email });
    return account != null;
}

module.exports = accountsModel;