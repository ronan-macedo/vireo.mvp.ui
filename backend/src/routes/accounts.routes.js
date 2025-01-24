const router = require('express').Router();
const utils = require('../utils');
const accountsController = require('../controllers/accounts.controller');
const commonValidator = require('../validators/common.validator');
const accountsValidator = require('../validators/accounts.validator');

router.get('/:id', utils.checkJwtToken, commonValidator.idRules(), utils.errorHandler(accountsController.getAccount));

router.post('/register', utils.checkJwtToken, accountsValidator.addRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.registerAccount));

router.post('/login', accountsValidator.loginRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.loginAccount));

router.put('/account/:id', utils.checkJwtToken, commonValidator.idRules(), accountsValidator.updateRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.updateAccount));

router.put('/password/:id', utils.checkJwtToken, commonValidator.idRules(), accountsValidator.updatePasswordRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.updatePassword));

router.put('/admin/:id', utils.checkIsAdmin, commonValidator.idRules(), accountsValidator.updateAdminRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.updateAdmin));

router.delete('/:id', utils.checkIsAdmin, commonValidator.idRules(), commonValidator.checkValidationRules, utils.errorHandler(accountsController.deleteAccount));

module.exports = router;