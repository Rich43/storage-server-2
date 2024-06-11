exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Thumbnail').del()
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
                {url: 'http://example.com/thumbnail9', mediaId: 9},
                {url: 'http://example.com/thumbnail10', mediaId: 10},
                {url: 'http://example.com/thumbnail11', mediaId: 11},
                {url: 'http://example.com/thumbnail12', mediaId: 12},
                {url: 'http://example.com/thumbnail13', mediaId: 13},
                {url: 'http://example.com/thumbnail14', mediaId: 14},
                {url: 'http://example.com/thumbnail15', mediaId: 15},
                {url: 'http://example.com/thumbnail16', mediaId: 16},
                {url: 'http://example.com/thumbnail17', mediaId: 17},
                {url: 'http://example.com/thumbnail18', mediaId: 18},
                {url: 'http://example.com/thumbnail19', mediaId: 19},
                {url: 'http://example.com/thumbnail20', mediaId: 20}
            ]);
        });
};
