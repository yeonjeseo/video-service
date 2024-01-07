import express from 'express';
import cors from 'cors';
import rootRoute from './routes/index.js';
import swaggerRouter from "./docs/index.js";

const app = express();

app.use('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', swaggerRouter);
app.use('/api', rootRoute);

export default app;


