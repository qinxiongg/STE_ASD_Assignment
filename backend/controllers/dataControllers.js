const AppDataSource = require('../ormconfig');
const csvParser = require('csv-parser');
const DataModel = require('../models/DataModel');
const { Like } = require('typeorm');

const UploadData = async (req, reply) => {
  const file = await req.file();

  if (!file) {
    return reply.code(400).send({ error: 'No file uploaded' });
  }

  try {
    const parsedData = [];

    await new Promise((resolve, reject) => {
      const fileStream = file.file;
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
    const page = parseInt(req.body.page);
    const limitPerPage = parseInt(req.body.limitPerPage);
    const offset = (page - 1) * limitPerPage;

    const [data, totalCount] = await dataRepository.findAndCount({
      skip: offset,
      take: limitPerPage,
    });

    reply.send({
      data,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitPerPage),
    });
  } catch (error) {
    reply.code(500).send({ error: 'Unable to fetch data.' });
  }
};

const SearchData = async (req, reply) => {
  const dataRepository = AppDataSource.getRepository(DataModel);
  const { searchTerm } = req.body;
  const page = parseInt(req.body.page);
  const limitPerPage = parseInt(req.body.limitPerPage);
  const offset = (page - 1) * limitPerPage;

  console.log('searchTerm', searchTerm);

  try {
    const [data, totalCount] = await dataRepository.findAndCount({
      skip: offset,
      take: limitPerPage,
      where: [
        { postId: Like(`%${searchTerm}%`) },
        { id: Like(`%${searchTerm}%`) },
        { name: Like(`%${searchTerm}%`) },
        { email: Like(`%${searchTerm}%`) },
        { body: Like(`%${searchTerm}%`) },
      ],
    });

    reply.send({
      data,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limitPerPage),
    });
  } catch (error) {
    console.error('Error during search:', error);

    reply.code(500).send({ error: 'Unable to fetch search data.' });
  }
};


module.exports = { UploadData, DisplayData, SearchData };
