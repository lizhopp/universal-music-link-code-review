import express, { urlencoded } from 'express';
import morgan from 'morgan';
import getUserFromToken from '#middleware/getUserFromToken';

//routes imports
import usersRouter from '#api/users';
import prefRouter from '#api/preferences';
import conversionRouter from '#api/conversions';
import convertRouter from '#api/convert';


const app = express();
export default app;

import cors from 'cors';

app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.get('/health', (_req, res) => {
    res.status(200).send('ok 👍🏽');
});

app.use(getUserFromToken);

app.use('/users', usersRouter);

app.use('/preferences', prefRouter);

app.use('/conversions', conversionRouter);

app.use('/convert', convertRouter);

app.use((err, req, res, next) => {
    switch (err.code) {

        case "22P02":
            return res.status(400).send(err.message);

        case "23505":
        case "23503":
            return res.status(400).send(err.detail);
        default:
            next(err);
    }
});

app.use((req, res) => {
  return res.status(404).json({
    message: 'Route not found.'
  });
});


app.use((err, req, res, next) => {
    res.status(500).send('Sorry! Something went wrong. Try again later.')
});






