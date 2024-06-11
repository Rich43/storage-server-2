exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Media').del()
        .then(function () {
            // Inserts seed entries for Media table
            return knex('Media').insert([
                // Images
                {title: 'Sample Image 1', url: 'http://example.com/media1.jpg', thumbnail: 'thumbnail1.png', userId: 1, mimetypeId: 1, adminOnly: false},
                {title: 'Sample Image 2', url: 'http://example.com/media2.png', thumbnail: 'thumbnail2.png', userId: 2, mimetypeId: 2, adminOnly: false},
                {title: 'Sample Image 3', url: 'http://example.com/media3.gif', thumbnail: 'thumbnail3.png', userId: 3, mimetypeId: 3, adminOnly: true},
                {title: 'Sample Image 4', url: 'http://example.com/media4.jpg', thumbnail: 'thumbnail4.png', userId: 1, mimetypeId: 1, adminOnly: true},
                {title: 'Sample Image 5', url: 'http://example.com/media5.png', thumbnail: 'thumbnail5.png', userId: 2, mimetypeId: 2, adminOnly: false},
                {title: 'Sample Image 6', url: 'http://example.com/media6.jpg', thumbnail: 'thumbnail6.png', userId: 3, mimetypeId: 1, adminOnly: false},

                // Videos
                {title: 'Sample Video 1', url: 'http://example.com/media7.mp4', thumbnail: 'thumbnail7.png', userId: 1, mimetypeId: 4, adminOnly: true},
                {title: 'Sample Video 2', url: 'http://example.com/media8.avi', thumbnail: 'thumbnail8.png', userId: 2, mimetypeId: 5, adminOnly: false},
                {title: 'Sample Video 3', url: 'http://example.com/media9.mp4', thumbnail: 'thumbnail9.png', userId: 3, mimetypeId: 4, adminOnly: true},
                {title: 'Sample Video 4', url: 'http://example.com/media10.avi', thumbnail: 'thumbnail10.png', userId: 4, mimetypeId: 5, adminOnly: false},
                {title: 'Sample Video 5', url: 'http://example.com/media11.mp4', thumbnail: 'thumbnail11.png', userId: 1, mimetypeId: 4, adminOnly: true},
                {title: 'Sample Video 6', url: 'http://example.com/media12.mp4', thumbnail: 'thumbnail12.png', userId: 2, mimetypeId: 4, adminOnly: false},

                // Audio
                {title: 'Sample Audio 1', url: 'http://example.com/media13.mp3', thumbnail: 'thumbnail13.png', userId: 3, mimetypeId: 6, adminOnly: false},
                {title: 'Sample Audio 2', url: 'http://example.com/media14.wav', thumbnail: 'thumbnail14.png', userId: 4, mimetypeId: 7, adminOnly: true},
                {title: 'Sample Audio 3', url: 'http://example.com/media15.mp3', thumbnail: 'thumbnail15.png', userId: 1, mimetypeId: 6, adminOnly: true},
                {title: 'Sample Audio 4', url: 'http://example.com/media16.wav', thumbnail: 'thumbnail16.png', userId: 2, mimetypeId: 7, adminOnly: false},
                {title: 'Sample Audio 5', url: 'http://example.com/media17.mp3', thumbnail: 'thumbnail17.png', userId: 3, mimetypeId: 6, adminOnly: false},
                {title: 'Sample Audio 6', url: 'http://example.com/media18.wav', thumbnail: 'thumbnail18.png', userId: 4, mimetypeId: 7, adminOnly: true},

                // Documents
                {title: 'Sample Document 1', url: 'http://example.com/media19.pdf', thumbnail: 'thumbnail19.png', userId: 1, mimetypeId: 8, adminOnly: true},
                {title: 'Sample Document 2', url: 'http://example.com/media20.zip', thumbnail: 'thumbnail20.png', userId: 4, mimetypeId: 9, adminOnly: true}
            ]);
        });
};
