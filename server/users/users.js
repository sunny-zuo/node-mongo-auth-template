const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.post('/register', register);
router.post('/authenticate', authenticate);

function register(req, res) {
    // check if user already exists

    // register user
    let hash = bcrypt.hashSync(req.body.password);
    console.log(hash);
    res.status(200).send('success');
}

function authenticate(req, res, next) {
    // validate password
    bcrypt.compareSync(req.body.password, '$2a$10$zSttFj9BFtMi38jWiJLbzeQly.lmdw2.dYeyNkKVG3kGbR4cW0yPq');
}

module.exports = router;