const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const database = require('../database');

router.post('/register', register);
router.post('/authenticate', authenticate);

async function register(req, res) {
    // check if user already exists
    let userExists = await database.getUser(req.body.username);
    if (userExists) {
        res.status(403).send({error: 'Username already exists'});
        return;
    }

    // register user
    let user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password)
    }

    database.addUser(user).then(result => {
        if (result === 'success') {
            // TODO: create jwt token to return
            res.status(200).send('success');
        } else {
            res.status(500).send(result);
        }
    });
}

function authenticate(req, res, next) {
    // validate password
    bcrypt.compareSync(req.body.password, '$2a$10$zSttFj9BFtMi38jWiJLbzeQly.lmdw2.dYeyNkKVG3kGbR4cW0yPq');
}

module.exports = router;