import { getUserById } from "#db/queries/users";
import { verifyToken } from "../utils/jwt.js";


export default async function getUserFromToken(req, res, next) {
    const auth = req.get('authorization');

    if(!auth || !auth.startsWith('Bearer')) return next();


    const token = auth.split(' ')[1];
    try {
        const { id } = verifyToken(token);
        const user = await getUserById(id);
        req.user = user;
        next();

    } catch (e) {
        res.status(401).send('Invalid token.');
    }
}