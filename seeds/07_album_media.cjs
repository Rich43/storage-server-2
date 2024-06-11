exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Album_Media').del()
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
                {albumId: 4, mediaId: 9},
                {albumId: 1, mediaId: 10},
                {albumId: 2, mediaId: 11},
                {albumId: 2, mediaId: 12},
                {albumId: 3, mediaId: 13},
                {albumId: 3, mediaId: 14},
                {albumId: 4, mediaId: 15},
                {albumId: 1, mediaId: 16},
                {albumId: 1, mediaId: 17},
                {albumId: 2, mediaId: 18},
                {albumId: 3, mediaId: 19},
                {albumId: 4, mediaId: 20},
                {albumId: 1, mediaId: 21},
                {albumId: 2, mediaId: 22},
                {albumId: 3, mediaId: 23}
            ]);
        });
};
