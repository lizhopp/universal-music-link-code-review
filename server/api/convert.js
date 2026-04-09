import express from 'express';

const router = express.Router();
export default router;

router.post('/', async (req, res) =>{
    res.status(200).json({
        route:'/convert',
        method: 'POST',
        message: 'Convert route wired. No logic yet.'
    })
})