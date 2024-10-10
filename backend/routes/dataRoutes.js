const dataController = require('../controllers/dataControllers');

const dataRoutes = async (fastify, options) => {
  fastify.post('/api/UploadData', dataController.UploadData);
  fastify.post('/api/DisplayData', dataController.DisplayData);
  fastify.post('/api/SearchData', dataController.SearchData);
};

module.exports = dataRoutes;
