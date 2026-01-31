
CREATE TABLE users(
 id SERIAL PRIMARY KEY,
 email TEXT,
 password TEXT,
 role TEXT,
 upt TEXT
);

CREATE TABLE gangguan(
 id SERIAL PRIMARY KEY,
 upt TEXT,
 status TEXT,
 lat FLOAT,
 lng FLOAT,
 waktu TIMESTAMP DEFAULT now()
);
