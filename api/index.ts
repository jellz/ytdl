// imports
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRoute from './routes/api';

const app = express();

// middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.static('src/static'));

// routes
app.use('/api', apiRoute);
app.use((req: Request, res: Response) => res.sendStatus(404));

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));
