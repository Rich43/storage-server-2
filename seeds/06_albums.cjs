exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('Album').del()
        .then(function () {
            // Inserts seed entries for Album table
            return knex('Album').insert([
                {title: 'Sample Album 1', userId: 1},
                {title: 'Sample Album 2', userId: 2},
                {title: 'Sample Album 3', userId: 3},
                {title: 'Sample Album 4', userId: 4}
            ]);
        });
};
