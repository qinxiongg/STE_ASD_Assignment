const { DataSource } = require('typeorm');
const DataModel = require('./models/DataModel');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'asd_assignment',
  synchronize: false,
  logging: false,
  entities: [DataModel],
});

module.exports = AppDataSource;
