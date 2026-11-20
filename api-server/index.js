var restify = require('restify');
const { Client } = require('pg');

var server = restify.createServer();

var corsMiddleware = require('restify-cors-middleware2');
var cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['X-App-Version'],
  exposeHeaders: []
});
server.pre(cors.preflight);
server.use(cors.actual);

// Create a new database connection using the settings from .env
function newClient() {
  return new Client({
    host:     process.env.POSTGRES_HOST,
    port:     process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user:     process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
}

// GET /  → is the server up? is the database up?
server.get('/', async function (req, res) {
  const client = newClient();
  var db_info = "Database is up & running";
  try {
    await client.connect();
  } catch (e) {
    db_info = "Cannot connect to database!";
    console.log(e);
  } finally {
    await client.end();
  }

  res.send({
    Server: "Server is working",
    Database: db_info
  });
});

// GET /room  → list of all rooms
server.get('/room', async function (req, res) {
  const client = newClient();
  var result = [];
  try {
    await client.connect();
    const query = await client.query("select * from room");
    result = query.rows;
  } catch (e) {
    console.log(e);
  } finally {
    await client.end();
  }

  res.send({
    rooms: result
  });
});

var PORT = 8080;
server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});
