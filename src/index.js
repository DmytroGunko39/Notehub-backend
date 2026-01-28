import express from 'express';
import pino from 'pino-http';

const PORT = 3000;
const app = express();

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toISOString()}`);
  next();
});

//Обробка JSON-даних
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

app.use(
  pino({
    transport: {
      target: 'pino-pretty',
    },
  }),
);

//клієнт звертається до неіснуючого маршруту
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

//коли виникає непередбачувана помилка
app.use((err, req, res, next) => {
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
