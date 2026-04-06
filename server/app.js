import express, { urlencoded } from 'express';
import morgan from 'morgan';
import getUserFromToken from '#middleware/getUserFromToken';
import usersRouter from '#api/users';
const app = express();
export default app;



app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));

app.use(getUserFromToken);

app.use('/users', usersRouter);





