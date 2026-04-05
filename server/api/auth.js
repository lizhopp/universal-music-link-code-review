import express from 'express';
import requireBody from '#middleware/requireBody';
import { createUser, getUserByEmailAndPassword } from '#db/queries/users';
import { createToken } from '#utils/jwt';


const router = express.Router();
export default router;


router.use(requireBody(['email', 'password']));

router.use('/register', async (req, res) => {
    const user = await createUser(req.body.email, req.body.password);

    const token = createToken({ id: user.id });
    res.status(201).send(token);
})

router.use('/login', async (req, res) => {
    const user = await getUserByEmailAndPassword(req.body.email, req.body.password);

    if(!user) return res.status(401).send('Invalid email and password combo.');

    const token = createToken({id: user.id});
    res.send(token);
    
})