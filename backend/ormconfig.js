const { DataSource } = require('typeorm');
const DataModel = require('./models/DataModel');
const dotenv = require('dotenv');
dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [DataModel],
});

module.exports = AppDataSource;
