import express from 'express';

const router = express.Router();
export default router;

router.get('/', async (req, res) =>{
    return res.status(200).json({
        route: '/preferences',
        method: 'GET',
        message: 'Preferences route wired. No logic yet.'
    })
})

router.put('/', async (req, res) =>{
    return res.status(200).json({
    route: '/preferences',
    method: 'PUT',
    message:'Update users preferences isf. No logic yet'
});
});