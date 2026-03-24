//import userById query 
import { verifyToken } from "../utils/jwt.js";


export default async function getUserFromToken(req, res, next) {
    const auth = req.get('authorization');

    if(!auth || !auth.startsWith('Bearer')) return next();


    const token = auth.split('')[1];
    try {
        const { id } = verifyToken(token);
        const user = await //getuserbyid query
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send('Invalid token.');
    }
}