import jwt from 'jsonwebtoken';


const SECRET = process.env.JWT_SECRET;

function getJwtSecret() {
    // WHY (Functionality + Documentation): fail fast with a clear auth-specific error so startup/config mistakes are easier to diagnose than generic token failures.
    if (!SECRET) {
        throw new Error('JWT_SECRET is missing. Authentication tokens cannot be created or verified.');
    }

    return SECRET;
}

export function createToken(payload){
    return jwt.sign(payload, getJwtSecret(), {expiresIn: '7d'});
}

export function verifyToken(token) {
    return jwt.verify(token, getJwtSecret());
}