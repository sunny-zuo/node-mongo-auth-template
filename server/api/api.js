const express = require('express');
const router = express.Router();
const expressJWT = require('express-jwt');
const dotenv = require('dotenv').config();

// Set JWT validation middleware
router.use(expressJWT( { secret: process.env.JWT_SECRET, algorithms: ['HS256']}));
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({error: err});
        return;
    }
    next();
});

router.get('/hello', function (req, res) {
    res.send({ message: `hello ${req.user.username}` })
});

module.exports = router;