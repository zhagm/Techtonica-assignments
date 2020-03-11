-- -> psql postgres

CREATE DATABASE pern;
-- CREATE DATABASE

\c pern
-- You are now connected to database "pern" as user "zhag".

CREATE TABLE species(
    id INTEGER PRIMARY KEY, 
    common_name TEXT,
    scientific_name TEXT,
    quantity INTEGER,
    conservatin_status_code TEXT,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE

CREATE TABLE individuals(
    id INTEGER PRIMARY KEY, 
    nickname TEXT,
    species_id INTEGER REFERENCES species(id) ON DELETE CASCADE,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE

CREATE TABLE sightings(
    id SERIAL PRIMARY KEY,
    sighting_timestamp TIMESTAMP,
    sighting_location TEXT,
    individual_id INTEGER REFERENCES individuals(id) ON DELETE CASCADE,
    is_healthy BOOLEAN,
    sighter_email TEXT,
    created_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- CREATE TABLE

INSERT INTO species(id, common_name, scientific_name, quantity) VALUES(1, 'Pangolin', 'Manis pentadactyla', 1000000);
INSERT INTO species(id, common_name, scientific_name, quantity) VALUES(2, 'Tiger', 'Panthera tigris', 3900);
INSERT INTO species(id, common_name, scientific_name, quantity) VALUES(3, 'Racoon', 'Procyon lotor', 30000);

INSERT INTO individuals(id, nickname, species_id) VALUES(11, 'Pangolini', 1);
INSERT INTO individuals(id, nickname, species_id) VALUES(22, 'Tig', 2);
INSERT INTO individuals(id, nickname, species_id) VALUES(33, 'Joe', 3);
INSERT INTO individuals(id, nickname, species_id) VALUES(44, 'Pernie', 1);
INSERT INTO individuals(id, nickname, species_id) VALUES(55, 'Dragon', 2);
INSERT INTO individuals(id, nickname, species_id) VALUES(66, 'Ron', 3);

INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(111, '2020-01-01', 'San Francisco, CA', 33, true, 'zhag@mail.com');
INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(222, '2020-03-01', 'Denver, CO', 33, true, 'zhag@mail.com');
INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(333, '2020-03-01', 'London, UK', 11, false, 'zhag@mail.com');
INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(444, '2020-02-29', 'Rockville, MD', 44, true, 'zmag@mail.com');
INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(555, '2019-12-23', 'Toronto, Canada', 66, true, 'user2@mail.com');
INSERT INTO sightings(id, sighting_timestamp, sighting_location, individual_id, is_healthy, sighter_email) 
                VALUES(666, '2020-03-08', 'Mexico City, MX', 66, false, 'user1@mail.com');

\dt
--           List of relations
--  Schema |    Name    | Type  | Owner 
-- --------+------------+-------+-------
--  public | individuals | table | zhag
--  public | sightings  | table | zhag
--  public | species    | table | zhag
-- (3 rows)