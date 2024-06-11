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
                { type: 'application/pdf', category: 'DOCUMENT' },
                { type: 'application/msword', category: 'DOCUMENT' },
                { type: 'application/vnd.ms-powerpoint', category: 'DOCUMENT' },
                { type: 'application/vnd.ms-excel', category: 'DOCUMENT' },
                { type: 'application/zip', category: 'OTHER' },
                { type: 'application/x-rar-compressed', category: 'OTHER' }
            ]);
        });
};
