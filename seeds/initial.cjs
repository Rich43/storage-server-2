exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Album_Media').del()
        .then(() => knex('Album').del())
        .then(() => knex('Thumbnail').del())
        .then(() => knex('Session').del())
        .then(() => knex('Media').del())
        .then(() => knex('User').del())
        .then(function () {
            // Inserts seed entries for User table
            return knex('User').insert([
                {username: 'john_doe', password: 'password123', avatar: 'avatar1.png', admin: true},
                {username: 'jane_doe', password: 'password123', avatar: 'avatar2.png', admin: false}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Media table
            return knex('Media').insert([
                {title: 'Sample Media 1', url: 'http://example.com/media1', mimetype: 'image/jpeg', thumbnail: 'thumbnail1.png', userId: 1},
                {title: 'Sample Media 2', url: 'http://example.com/media2', mimetype: 'image/png', thumbnail: 'thumbnail2.png', userId: 2}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Session table
            return knex('Session').insert([
                {userId: 1, sessionToken: 'token123', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 2, sessionToken: 'token456', sessionExpireDateTime: '2024-12-31 23:59:59'}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Thumbnail table
            return knex('Thumbnail').insert([
                {url: 'http://example.com/thumbnail1', mediaId: 1},
                {url: 'http://example.com/thumbnail2', mediaId: 2}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Album table
            return knex('Album').insert([
                {title: 'Sample Album 1', userId: 1},
                {title: 'Sample Album 2', userId: 2}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Album_Media table
            return knex('Album_Media').insert([
                {albumId: 1, mediaId: 1},
                {albumId: 2, mediaId: 2}
            ]);
        });
};
