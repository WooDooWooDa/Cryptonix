let mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function connect() {
    return new Promise((resolve, reject) => {
        mongoClient.connect(url, function(err, client) {
            if (err) reject(err);
            let db = client.db('cryptonix');
            resolve(db);
            client.close();
        });
    });
}

exports.findByEmail = function findUserByEmail(value) {
    return connect.then(db => {
        db.collection('users').find({email: value}).toArray(function(err, result) {
            if (err) throw err;
            return result
        })
    }).catch(err => {
        console.log(err);
        return null;
    });
}