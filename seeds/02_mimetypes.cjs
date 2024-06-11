exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Mimetype').del()
        .then(function () {
            // Inserts seed entries for Mimetype table
            return knex('Mimetype').insert([
                { type: 'image/jpeg', category: 'IMAGE' },
                { type: 'image/png', category: 'IMAGE' },
                { type: 'image/gif', category: 'IMAGE' },
                { type: 'video/mp4', category: 'VIDEO' },
                { type: 'video/avi', category: 'VIDEO' },
                { type: 'audio/mp3', category: 'AUDIO' },
                { type: 'audio/wav', category: 'AUDIO' },
                { type: 'application/pdf', category: 'OTHER' },
                { type: 'application/zip', category: 'OTHER' }
            ]);
        });
};
