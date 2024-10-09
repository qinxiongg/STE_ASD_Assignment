const fs = require('fs');
const fastify = require('fastify')();
const AppDataSource = require('../ormconfig');
const csvParser = require('csv-parser');
const { connectDB } = require('../config/db');
const dataModel = require('../models/dataModel');

const UploadData = async (req, reply) => {
  const file = await req.file();

  console.log('Received file:', file); // Log the file object


  if (!file) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }

  //   const collection = await connectDB.collection('data');

  try {
    const parsedData = [];

    await new Promise((resolve, reject) => {
      const fileStream = file.file; // Get the file stream
      fileStream
        .pipe(csvParser())
        .on('data', (row) => {
          // Each row in CSV will be pushed into parsedData array
          parsedData.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    const dataRepository = AppDataSource.getRepository(dataModel);

    // insert parsed data into MongoDB
    await dataRepository.save(parsedData);

    reply.code(200).send({ message: 'Successfully uploaded file.' });
  } catch (error) {
    console.error('Error uploading data', error);
    reply.code(500).send({ error: 'Failed to upload and insert data!' });
  }
};

module.exports = { UploadData };
