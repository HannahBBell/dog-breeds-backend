CREATE TABLE dogs_table (ID SERIAL PRIMARY KEY, DOG VARCHAR(255), VOTE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

INSERT INTO dogs_table (dog) VALUES ('poodle');

INSERT INTO dogs_table (dog) VALUES ('labradoodle');