const fs = require('fs');
const AppDataSource = require('../ormconfig');
const csvParser = require('csv-parser');
const DataModel = require('../models/DataModel');

const UploadData = async (req, reply) => {
  const file = await req.file();

  console.log('Received file:', file); // Log the file object

  if (!file) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }

  try {
    const parsedData = [];

    await new Promise((resolve, reject) => {
      const fileStream = file.file; // Get the file stream
      fileStream
        .pipe(csvParser())
        .on('data', (row) => {
          const cleanedKey = Object.fromEntries(
            Object.entries(row).map(([key, value]) => [
              key.replace(/['"]+/g, '').trim(), // Remove quotes and trim any whitespace
              value,
            ]),
          );

          parsedData.push(cleanedKey);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // Log all parsed data before attempting to save
    console.log('Parsed data array:', parsedData);

    // ensure parsed data matches model
    const dataRepository = AppDataSource.getRepository(DataModel);

    // insert parsed data into MYSQL
    await dataRepository.save(parsedData);

    reply.code(200).send({ message: 'Successfully uploaded file.' });
  } catch (error) {
    console.error('Error uploading data', error);
    reply.code(500).send({ error: 'Failed to upload and insert data!' });
  }
};

const DisplayData = async (req, reply) => {
  const dataRepository = AppDataSource.getRepository(DataModel);

  try {
    // const data = await dataRepository.find();
    // return reply.code(200).send(data);

    // Get page and limitPerPage from query params, set defaults if not provided
    const page = parseInt(req.body.page);
    const limitPerPage = parseInt(req.body.limitPerPage);
    const offset = (page - 1) * limitPerPage;

    // Fetch data with limitPerPage and offset
    const [data, totalCount] = await dataRepository.findAndCount({
      skip: offset,
      take: limitPerPage,
    });

    reply.send({
      data,
      totalCount, // Total number of rows in the table
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitPerPage),
    });
  } catch (error) {
    reply.code(500).send({ error: 'Unable to fetch data.' });
  }
};

module.exports = { UploadData, DisplayData };
