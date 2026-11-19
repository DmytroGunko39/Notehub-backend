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

export const createApp = () => {
  const app = express();
  app.set('trust proxy', 1);

  app.use(express.json());
  app.use(
    cors({
      origin: getEnvVar('FRONTEND_URL'),
      credentials: true,
    }),
  );
  app.use(cookieParser());

  //Request logging - keeps track of how the system behaves, especially when it runs into problems.
  app.use(
    pino({
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
    }),
  );

  app.use('/auth', authRateLimiter, authRouter);
  app.use('/notes', notesRouter);
  app.use('/users', usersRouter);

  // Root endpoint — confirms the API is reachable
  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'NoteHub API is running',
      data: {
        docs: 'https://github.com/DmytroGunko39/Notehub-backend',
      },
    });
  });

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
};

export const startServer = () => {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
