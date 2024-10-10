const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'data',
  columns: {
    postId: {
      type: 'int',
      primary: true,
      generated: false,
    },
    id: {
      primary: true,
      type: 'int',
      generated: false,
    },
    name: {
      type: 'varchar',
      nullable: true,
    },
    email: {
      type: 'varchar',
      nullable: true,
    },
    body: {
      type: 'mediumtext',
      nullable: true,
    },
  },
});
