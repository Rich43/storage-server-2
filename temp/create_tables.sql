-- User Table
CREATE TABLE IF NOT EXISTS User (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255)
);

-- Media Table
CREATE TABLE IF NOT EXISTS Media (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    mimetype VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
);

-- Session Table
CREATE TABLE IF NOT EXISTS Session (
    sessionId SERIAL PRIMARY KEY,
    userId INT NOT NULL,
    sessionToken VARCHAR(255) NOT NULL,
    sessionExpireDateTime TIMESTAMP NOT NULL,
    admin BOOLEAN NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
);

-- Thumbnail Table
CREATE TABLE IF NOT EXISTS Thumbnail (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    mediaId INT NOT NULL,
    FOREIGN KEY (mediaId) REFERENCES Media(id)
);

-- Album Table
CREATE TABLE IF NOT EXISTS Album (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES User(id)
);

-- Album_Media Join Table
CREATE TABLE IF NOT EXISTS Album_Media (
    albumId INT NOT NULL,
    mediaId INT NOT NULL,
    PRIMARY KEY (albumId, mediaId),
    FOREIGN KEY (albumId) REFERENCES Album(id) ON DELETE CASCADE,
    FOREIGN KEY (mediaId) REFERENCES Media(id) ON DELETE CASCADE
);
