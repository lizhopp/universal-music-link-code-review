import express, { urlencoded } from 'express';
import morgan from 'morgan';
import getUserFromToken from '#middleware/getUserFromToken';
import usersRouter from '#api/users';
const app = express();
export default app;

import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN, 
}));



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));


app.get('/health', (_req, res)=> {
    res.status(200).send('ok 👍🏽');
});

app.use(getUserFromToken);

app.use('/users', usersRouter);





