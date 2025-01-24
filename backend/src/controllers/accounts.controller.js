const { ObjectId } = require('mongodb');
const accountsModel = require('../models/accounts.model');
const utils = require('../utils');

const accountsController = {};

accountsController.getAccount = async (req, res) => {
    const accountId = new ObjectId(String(req.params.id));
    const account = await accountsModel.getAccount(accountId);

    try {
        if (!account) {
            await utils.notFoundResponse(res, 'account');
            return;
        }

        await utils.okResponse(res, account);
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

accountsController.registerAccount = async (req, res) => {
    const account = req.body;

    try {
        const result = await accountsModel.addAccount(account);

        if (result.acknowledged) {
            await utils.createdResponse(res, account);
            return;
        }

        await utils.badRequestResponse(res, 'Error while register a new account.');
    } catch (error) {
        await utils.internalServerErrorResponse(res, 'Account');
    }
}

accountsController.updateAccount = async (req, res) => {
    const accountId = new ObjectId(String(req.params.id));
    const account = req.body;

    try {
        const accountFound = await accountsModel.getAccount(accountId);

        if (!accountFound) {
            await utils.notFoundResponse(res, 'account');
            return;
        }

        const updateAccount = { ...accountFound, ...account };
        const result = await accountsModel.updateAccount(accountId, updateAccount);

        if (result.acknowledged) {
            await utils.okResponse(res, updateAccount);
            return;
        }

        await utils.badRequestResponse(res, 'Error while updating account.');
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

accountsController.updatePassword = async (req, res) => {
    const accountId = new ObjectId(String(req.params.id));
    const account = req.body;

    try {
        const accountFound = await accountsModel.getAccount(accountId);

        if (!accountFound) {
            await utils.notFoundResponse(res, 'account');
            return;
        }

        account.password = await utils.hashPassword(account.password);
        const updateAccount = { ...accountFound, ...account };

        const result = await accountsModel.updateAccount(accountId, updateAccount);

        if (result.acknowledged) {
            await utils.okResponse(res, updateAccount);
            return;
        }

        await utils.badRequestResponse(res, 'Error while updating password.');
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

accountsController.updateAdmin = async (req, res) => {
    const accountId = new ObjectId(String(req.params.id));
    const account = req.body;

    try {
        const accountFound = await accountsModel.getAccount(accountId);

        if (!accountFound) {
            await utils.notFoundResponse(res, 'account');
            return;
        }

        const updateAccount = { ...accountFound, ...account };
        const result = await accountsModel.updateAccount(accountId, updateAccount);

        if (result.acknowledged) {
            await utils.okResponse(res, account);
            return;
        }

        await utils.badRequestResponse(res, 'Error while updating admin status.');
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

accountsController.deleteAccount = async (req, res) => {
    const accountId = new ObjectId(String(req.params.id));

    try {
        const accountFound = await accountsModel.getAccount(accountId);

        if (!accountFound) {
            await utils.notFoundResponse(res, 'account');
            return;
        }

        const result = await accountsModel.deleteAccount(accountId);

        if (result.acknowledged) {
            await utils.noContentResponse(res);
            return;
        }

        await utils.badRequestResponse(res, 'Error while deleting account.');
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

accountsController.loginAccount = async (req, res, next) => {
    const account = req.body;

    try {
        const accountFound = await accountsModel.getAccountByEmail(account.email);

        if (!accountFound) {
            await utils.badRequestResponse(res, 'Invalid email or password.');
            return;
        }

        if (await utils.comparePasswords(account.password, accountFound.password)) {
            return utils.generateJwtToken(res, accountFound);
        } else {
            await utils.badRequestResponse(res, 'Invalid email or password.');
        }
    } catch (error) {
        await utils.internalServerErrorResponse(res, error);
    }
}

module.exports = accountsController;