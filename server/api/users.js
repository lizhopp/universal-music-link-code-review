import express from 'express';
import requireBody from '#middleware/requireBody';
import { createUser, getUserByEmailAndPassword, getUserByEmail } from '#db/queries/users';
import { createToken } from '#utils/jwt';


const router = express.Router();
export default router;

function serializedUser(user) {
    return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
    }
}

function normalizeCredentials(body) {
    // WHY (Code Style + Functionality): one shared normalization path keeps register/login behavior consistent and prevents subtle mismatches (like casing/whitespace) between endpoints.
    return {
        email: body.email?.trim().toLowerCase(),
        password: body.password,
    };
}




router.post('/register', requireBody(['email', 'password']), async (req, res) => {
    // WHY (Functionality): register should normalize credentials exactly the same way login does, so one account format behaves predictably in both flows.
    const { email, password } = normalizeCredentials(req.body);

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.',
        });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({
            message: 'An account with that email already exists.',
        });
    }

    const user = await createUser(email, password);
    const token = createToken({ id: user.id });

    return res.status(201).json({
        message: 'Account created successfully.',
        token,
        user: serializedUser(user),
    });
});

router.post('/login', requireBody(['email', 'password']), async (req, res) => {
    // WHY (Functionality): using the same normalization as register prevents avoidable login failures caused by email casing or trailing spaces.
    const { email, password } = normalizeCredentials(req.body);

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required.',
        });
    }

    const user = await getUserByEmailAndPassword(email, password);

    if (!user) {
        return res.status(401).json({
            message: 'Invalid combination of email and password.',
        });
    }

    const token = createToken({ id: user.id });

    return res.json({
        message: 'Logged in successfully.',
        token,
        user: serializedUser(user),
    });
});

router.get('/me', async (req,res) =>{
    // WHY (Functionality): auth/session endpoints should not be cached, or stale responses can make users look logged out when their token is still valid.
    res.set('Cache-Control', 'no-store');

    if(!req.user){
        return res.status(401).json({
            message: 'Authentication required.',
        });
    }

    return res.json({
        user: serializedUser(req.user),
    });
});