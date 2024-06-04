-- Seed Data for User Table
INSERT INTO User (username, password, avatar) VALUES ('john_doe', 'password123', 'avatar1.png');
INSERT INTO User (username, password, avatar) VALUES ('jane_doe', 'password123', 'avatar2.png');

-- Seed Data for Media Table
INSERT INTO Media (title, url, mimetype, thumbnail, userId) VALUES ('Sample Media 1', 'http://example.com/media1', 'image/jpeg', 'thumbnail1.png', 1);
INSERT INTO Media (title, url, mimetype, thumbnail, userId) VALUES ('Sample Media 2', 'http://example.com/media2', 'image/png', 'thumbnail2.png', 2);

-- Seed Data for Session Table
INSERT INTO Session (userId, sessionToken, sessionExpireDateTime, admin) VALUES (1, 'token123', '2024-12-31 23:59:59', true);
INSERT INTO Session (userId, sessionToken, sessionExpireDateTime, admin) VALUES (2, 'token456', '2024-12-31 23:59:59', false);

-- Seed Data for Thumbnail Table
INSERT INTO Thumbnail (url, mediaId) VALUES ('http://example.com/thumbnail1', 1);
INSERT INTO Thumbnail (url, mediaId) VALUES ('http://example.com/thumbnail2', 2);

-- Seed Data for Album Table
INSERT INTO Album (title, userId) VALUES ('Sample Album 1', 1);
INSERT INTO Album (title, userId) VALUES ('Sample Album 2', 2);

-- Seed Data for Album_Media Join Table
INSERT INTO Album_Media (albumId, mediaId) VALUES (1, 1);
INSERT INTO Album_Media (albumId, mediaId) VALUES (2, 2);
