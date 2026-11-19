//the file from which execution of our program begins
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  try {
    await initMongoDB();
    startServer();
  } catch (err) {
    console.error('Failed to start app', err);
    process.exit(1);
  }
};

bootstrap();
