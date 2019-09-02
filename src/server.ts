require('dotenv').config();
// imports
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRoute from './routes/api';

const app = express();

// middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('/api', apiRoute);

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
