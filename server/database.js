const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

// Create a new MongoClient
const mongoClient = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;

mongoClient.connect((err, client) => {
    if (err) { console.error(err) };
    db = client.db("database");
    console.log('Successfully connected to database');
})

async function getUser(username = null, email = null) {
    return new Promise((resolve, reject) => {
        try {
            db.collection("users").find({ 
                "$or": [{
                    username: username
                }, {
                    email: email  
                }]}).toArray(function (err, result) {
                if (err) throw err;
                resolve(result);
            })
        } catch (err) {
            reject(err);
        }
    });
}

async function addUser(obj) {
    return new Promise((resolve, reject) => {
        try {
            db.collection("users").insertOne(obj, function (err, res) {
                if (err) throw err;
                resolve('success');
            });
        } catch (err) {
            reject(err);
        }
    });
    
}

exports.getUser = getUser;
exports.addUser = addUser;