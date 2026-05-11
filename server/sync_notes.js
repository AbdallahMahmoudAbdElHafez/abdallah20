import { Note, sequelize } from './src/models/index.js';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await Note.sync({ alter: true });
    console.log('Notes table synced successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
})();
