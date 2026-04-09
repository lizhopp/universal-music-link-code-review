import express from 'express';

const router = express.Router();
export default router;


router.get('/', async (req,res) =>{
    return res.status(200).json({
        route: '/conversions',
        method: 'GET',
        message: 'Conversions route wired. No logic yet.'
    })
});

router.delete('/:id', async (req,res) =>{
    return res.status(200).json({
        route: '/conversions/:id',
        method:'DELETE',
        id: req.params.id,
        message:'Delete conversion route wired. No logic yet.'
    });
});