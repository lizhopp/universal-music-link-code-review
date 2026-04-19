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


router.use(requireBody(['email', 'password']));

router.post('/register', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

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

router.post('/login', async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

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
    if(!req.user){
        return res.status(401).json({
            message: 'Authentication required.',
        });
    }

    return res.json({
        user: serializedUser(req.user),
    });
});