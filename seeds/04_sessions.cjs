exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Session').del()
        .then(function () {
            // Inserts seed entries for Session table
            return knex('Session').insert([
                {userId: 1, sessionToken: 'token123', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 2, sessionToken: 'token456', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 3, sessionToken: 'token789', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 4, sessionToken: 'token101', sessionExpireDateTime: '2024-12-31 23:59:59'}
            ]);
        });
};
