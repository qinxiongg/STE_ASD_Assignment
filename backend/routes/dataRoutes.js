// const fastify = require('fastify')({ logger: true });
const dataController = require('../controllers/dataControllers');

const dataRoutes = async (fastify, options) => {
  fastify.post('/api/UploadData', dataController.UploadData);
  fastify.get('/api/DisplayData', dataController.DisplayData);
};

module.exports = dataRoutes;
