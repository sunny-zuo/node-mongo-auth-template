const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const database = require('../database');

const dotenv = require('dotenv').config();

router.post('/register', register);
router.post('/authenticate', authenticate);

async function register(req, res) {
    // verify that the request is valid
    if (!req.body.username || !req.body.email || !req.body.password) {
        res.status(400).send({ error: 'Not all fields were complete' });
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }
    // check if user already exists
    let userExists = await database.getUser(req.body.username, req.body.email);
    if (userExists) {
        res.status(403).send({error: 'Username or email already exists'});
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
                jwt: jwt.sign({ username: req.body.username }, process.env.JWT_SECRET) 
            });
        } else {
            res.status(500).send({ error: 'Internal server error'});
            console.log(`Internal server error: ${result}`);
        }
    });
}

async function authenticate(req, res, next) {
    // verify that request is valid
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ error: 'Not all fields were complete'});
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        res.status(400).send({ error: 'Invalid email' });
        return;
    }
    
    // get user info from database using email
    let user = await database.getUser(null, req.body.email);
    if (user) {
        // sign JWT if password matches and respond
        if (bcrypt.compareSync(req.body.password, user.password)) {
            res.status(200).send({
                jwt: jwt.sign({ username: req.body.username }, process.env.JWT_SECRET)
            });
        } else {
            res.status(403).send({ error: 'Incorrect password'})
        }
    } else {
        res.status(403).send({ error: 'User does not exist'});
    }
}

module.exports = router;