const router = require('express').Router();

router.use('/health', require('./healthcheck.routes'));

router.use('/accounts', require('./accounts.routes'));

module.exports = router;