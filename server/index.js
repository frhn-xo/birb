import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import errorMiddleware from './middlewares/errorMiddeware.js';
import router from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(errorMiddleware);

app.use(router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch(() => {
    console.log("could'nt connect to db");
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`runnin' on port ${PORT}`);
});
