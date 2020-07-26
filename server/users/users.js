const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const database = require('../database');

router.post('/register', register);
router.post('/authenticate', authenticate);

async function register(req, res) {

    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).send({ error: 'Not all fields were complete' });
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }
    // check if user already exists
    let userExists = await database.getUser(req.body.username);
    if (userExists.length > 0) {
        res.status(403).send({error: 'Username already exists'});
        return;
    }

    // register user
    let user = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    }

    database.addUser(user).then(result => {
        if (result === 'success') {
            // sign and send a jwt token upon successful registration
            res.status(200).send({ 
                jwt: jwt.sign({ username: req.body.username }, 'very secret token') 
            });
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