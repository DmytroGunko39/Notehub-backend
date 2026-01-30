//файл, з якого буде починатися виконання нашої програми
import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

//ініціалізує підключення до бази даних, після чого запускає сервер.
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

// Express - це популярна JavaScript бібліотека, яка призначена для розробки вебдодатків і API. Express побудований на базі Node.js і надає простий та ефективний спосіб створення серверних застосунків.
