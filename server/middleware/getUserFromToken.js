import { getUserById } from "#db/queries/users";
import { verifyToken } from "../utils/jwt.js";


export default async function getUserFromToken(req, res, next) {

    //pulls authorization values from http headers in the request. headers are case-insensitive so caps don't matter
    const auth = req.get('authorization');
    // if there is no authorization key:value pair, the middleware completes without getting a user from the token provided.
    if (!auth) return next();

    //if the authorization is malformed i.e missing Bearer or Bearer${token} -- missing space, it'll respond with a 401 error
    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({
            message: "Invalid token."
        });
    }

    //pulls the token only from the authorization since auth.split(' ') creates an array from the string
    //ex. ['Bearer', 'token']
    const token = auth.split(' ')[1];
    try {
        //deconstructs the return object of verifyToken to only the id.
        const { id } = verifyToken(token);
        //used the id to grab the user from the database
        const user = await getUserById(id);

        // WHY (Functionality): a token for a deleted user should fail auth immediately so protected routes do not continue with an invalid session.
        if (!user) {
            return res.status(401).json({
                message: "Invalid token."
            });
        }

        //places the user object into req.user
        req.user = user;
        // WHY (Code Style): return here so this branch exits explicitly, matching the style of every other branch in this function and preventing accidental fallthrough if code is added later.
        return next();
    //if there is an error retrieving the user from the DB, in jwt verification, malformed token payload, it's handled gracefully with the catch by responding with a json message
    } catch {
        return res.status(401).json({
            message: "Invalid token."
        });
    }
}