const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware2');

const server = restify.createServer();

const cors = corsMiddleware({
  preflightMaxAge: 5,
  origins: ['*'],
  allowHeaders: ['X-App-Version', 'Authorization'],
  exposeHeaders: []
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.use(restify.plugins.queryParser());

require('./routes/root').applyRoutes(server);
require('./routes/login').applyRoutes(server);
require('./routes/room').applyRoutes(server);

const PORT = 8080;
server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});
