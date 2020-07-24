const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/authenticate', authenticate);

function register(req, res, next) {

}

function authenticate(req, res, next) {

}

module.exports = router;