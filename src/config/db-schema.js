export const members = `CREATE TABLE IF NOT EXISTS members (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(200) NOT NULL UNIQUE,
    location VARCHAR(100) DEFAULT 'ETE',
    shares SMALLINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP,
    committee VARCHAR(100) unique,
    img VARCHAR(255) default 'https://firebasestorage.googleapis.com/v0/b/learn-firebase-bbe9f.appspot.com/o/profiles%2Falain%40gmail.com.jpg?alt=media&token=2a01735f-6560-45ef-86b2-b6536dcfcb40'
);

INSERT INTO members (name, email, location, shares, committee) VALUES
    ('Alain NIYONEMA', 'alainyern@gmail.com', 'ETE Year 3', 7, 'IT Manager');`;

export const login = `CREATE TABLE IF NOT EXISTS login (
    id serial NOT NULL PRIMARY KEY,
    hash varchar(255) NOT NULL UNIQUE,
    member_id INTEGER NOT NULL UNIQUE REFERENCES members(id) ON DELETE CASCADE,
    member_email VARCHAR(255)NOT NULL UNIQUE
);

INSERT INTO login (hash, member_id, member_email) VALUES
    ('$2a$10$si3eGwiNW0D/tguNcKsDgegE9VdlPyp5OqO0uEq6U/B2fVYKO0QKe', 1, 'alainyern@gmail.com');`;
