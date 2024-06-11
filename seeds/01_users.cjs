const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
}

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('User').del()
        .then(function () {
            // Inserts seed entries for User table
            return knex('User').insert([
                {username: 'john_doe', password: hashPassword('password123'), avatar: 'avatar1.png', admin: true},
                {username: 'jane_doe', password: hashPassword('password123'), avatar: 'avatar2.png', admin: false},
                {username: 'alice_smith', password: hashPassword('password123'), avatar: 'avatar3.png', admin: false},
                {username: 'bob_jones', password: hashPassword('password123'), avatar: 'avatar4.png', admin: false}
            ]);
        });
};
