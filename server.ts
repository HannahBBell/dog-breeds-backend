import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false }
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()) //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/dogs", async (req, res) => {
  const dogs = await client.query('SELECT dog, COUNT(*) FROM dogs_table GROUP BY dog ORDER BY COUNT(*) DESC LIMIT 3');
  res.json(dogs.rows);
});

app.get("/dogshour", async (req, res) => {
   const dogs = await client.query('SELECT dog, COUNT(*) FROM dogs_table WHERE vote_time BETWEEN NOW() - INTERVAL `20 MINUTES` AND NOW() GROUP BY dog ORDER BY COUNT(*) DESC');
   res.json(dogs.rows);
 });

app.post("/dogs", async (req, res) => {
  const {dog} = req.body;
  const newVote = await client.query('INSERT INTO dogs_table (dog) VALUES ($1) RETURNING *', [dog]);
  res.json(newVote.rows[0])
});


//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw 'Missing PORT environment variable.  Set it in .env file.';
}
app.listen(port, () => {
  console.log(`DOG voting server is up and running on port ${port}`);
});
