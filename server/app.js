import express from 'express';
import morgan from 'morgan';
const app = express();
export default app;



app.use(express.json());
app.use(morgan('dev'));


//routes


