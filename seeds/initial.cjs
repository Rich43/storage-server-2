const crypto = require('crypto');

function hashPassword(password) {
    return crypto.createHash('sha3-512').update(password).digest('hex');
}

exports.seed = function(knex) {
    // Deletes ALL existing entries in the correct order
    return knex('Album_Media').del()
        .then(() => knex('Album').del())
        .then(() => knex('Thumbnail').del())
        .then(() => knex('Session').del())
        .then(() => knex('Media').del())
        .then(() => knex('User').del())
        .then(() => knex('Mimetype').del())
        .then(function () {
            // Inserts seed entries for User table
            return knex('User').insert([
                {username: 'john_doe', password: hashPassword('password123'), avatar: 'avatar1.png', admin: true},
                {username: 'jane_doe', password: hashPassword('password123'), avatar: 'avatar2.png', admin: false},
                {username: 'alice_smith', password: hashPassword('password123'), avatar: 'avatar3.png', admin: false},
                {username: 'bob_jones', password: hashPassword('password123'), avatar: 'avatar4.png', admin: false}
            ]);
        })
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
        })
        .then(function () {
            // Inserts seed entries for Media table
            return knex('Media').insert([
                {title: 'Sample Image 1', url: 'http://example.com/media1.jpg', thumbnail: 'thumbnail1.png', userId: 1, mimetypeId: 1, adminOnly: false},
                {title: 'Sample Image 2', url: 'http://example.com/media2.png', thumbnail: 'thumbnail2.png', userId: 2, mimetypeId: 2, adminOnly: false},
                {title: 'Sample Image 3', url: 'http://example.com/media3.gif', thumbnail: 'thumbnail3.png', userId: 3, mimetypeId: 3, adminOnly: false},
                {title: 'Sample Video 1', url: 'http://example.com/media4.mp4', thumbnail: 'thumbnail4.png', userId: 1, mimetypeId: 4, adminOnly: true},
                {title: 'Sample Video 2', url: 'http://example.com/media5.avi', thumbnail: 'thumbnail5.png', userId: 2, mimetypeId: 5, adminOnly: true},
                {title: 'Sample Audio 1', url: 'http://example.com/media6.mp3', thumbnail: 'thumbnail6.png', userId: 3, mimetypeId: 6, adminOnly: false},
                {title: 'Sample Audio 2', url: 'http://example.com/media7.wav', thumbnail: 'thumbnail7.png', userId: 4, mimetypeId: 7, adminOnly: false},
                {title: 'Sample Document 1', url: 'http://example.com/media8.pdf', thumbnail: 'thumbnail8.png', userId: 1, mimetypeId: 8, adminOnly: true},
                {title: 'Sample Archive 1', url: 'http://example.com/media9.zip', thumbnail: 'thumbnail9.png', userId: 4, mimetypeId: 9, adminOnly: true}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Session table
            return knex('Session').insert([
                {userId: 1, sessionToken: 'token123', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 2, sessionToken: 'token456', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 3, sessionToken: 'token789', sessionExpireDateTime: '2024-12-31 23:59:59'},
                {userId: 4, sessionToken: 'token101', sessionExpireDateTime: '2024-12-31 23:59:59'}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Thumbnail table
            return knex('Thumbnail').insert([
                {url: 'http://example.com/thumbnail1', mediaId: 1},
                {url: 'http://example.com/thumbnail2', mediaId: 2},
                {url: 'http://example.com/thumbnail3', mediaId: 3},
                {url: 'http://example.com/thumbnail4', mediaId: 4},
                {url: 'http://example.com/thumbnail5', mediaId: 5},
                {url: 'http://example.com/thumbnail6', mediaId: 6},
                {url: 'http://example.com/thumbnail7', mediaId: 7},
                {url: 'http://example.com/thumbnail8', mediaId: 8},
                {url: 'http://example.com/thumbnail9', mediaId: 9}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Album table
            return knex('Album').insert([
                {title: 'Sample Album 1', userId: 1},
                {title: 'Sample Album 2', userId: 2},
                {title: 'Sample Album 3', userId: 3},
                {title: 'Sample Album 4', userId: 4}
            ]);
        })
        .then(function () {
            // Inserts seed entries for Album_Media table
            return knex('Album_Media').insert([
                {albumId: 1, mediaId: 1},
                {albumId: 1, mediaId: 4},
                {albumId: 2, mediaId: 2},
                {albumId: 2, mediaId: 5},
                {albumId: 3, mediaId: 3},
                {albumId: 3, mediaId: 6},
                {albumId: 4, mediaId: 7},
                {albumId: 4, mediaId: 8},
                {albumId: 4, mediaId: 9}
            ]);
        });
};
