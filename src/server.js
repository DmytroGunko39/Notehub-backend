//файл, де ми опишемо наш express-сервер

import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notesRouter from './routers/notes.js';
import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authRateLimiter } from './middlewares/rateLimit.js';

const PORT = Number(getEnvVar('PORT', '3000'));

export const startServer = () => {
  const app = express();

  //Обробка JSON-даних
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  //Логування запитів - слідкувати за тим, як працює система, особливо, коли вона має проблеми.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Додаємо роутери до app як middleware
  app.use(authRouter, authRateLimiter);
  app.use(notesRouter);
  app.use(usersRouter);

  //клієнт звертається до неіснуючого маршруту
  app.use(notFoundHandler);

  //коли виникає непередбачувана помилка
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
