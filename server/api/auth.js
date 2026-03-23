import express from 'express';

const router = express.Router();
export default router;


//need middleware that validates required body content

router.use('/register', async(req, res)=>{
    const user = await //need createUser function


})

router.use('/login', async (req, res)=>{
    const user = await //need getUser function
    
})