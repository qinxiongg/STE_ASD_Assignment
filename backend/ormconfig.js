const { DataSource } = require('typeorm');
const dataModel = require('./models/dataModel');    

const AppDataSource = new DataSource({
  type: 'mongodb',
  url: 'mongodb://localhost:27017/data',
  useUnifiedTopology: true,
  synchronize: true,
  entities: [dataModel],
});

module.exports = AppDataSource;