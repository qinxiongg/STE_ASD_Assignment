const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'data',
  columns: {
    postId: {
      type: 'int',
    },
    id: {
      primary: true,
      type: 'int',
      generated: false,
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    body: {
      type: 'string',
    },
  },
});
