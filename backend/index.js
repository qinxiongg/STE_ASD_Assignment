const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const dataController = require('./controllers/dataControllers');
const fastifyMultipart = require('@fastify/multipart');
const AppDataSource = require('./ormconfig');

// initalise data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data source initialised');
  })
  .catch((err) => {
    console.error('Error when initialising data source', err);
  });

fastify.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
});

fastify.register(fastifyMultipart, {
  addToBody: true,
});

fastify.post('/api/UploadData', dataController.UploadData);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server listening at ${address}`);
});
