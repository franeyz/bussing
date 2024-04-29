import '../config.mjs';
import '../auth.mjs';
import dotenv from 'dotenv';
import express from 'express';
const router = express.Router();
import cors from 'cors';
import {auth} from '../auth.mjs';
import {registerUser,loginUser, getSchedules, getMyRoutes, selectMyRoutes, updateRoutes} from '../controllers/controller.mjs';

dotenv.config();

const origin = process.env.CLIENT ?? 'http://localhost:8000';

console.log('CORS origin:', origin);

router.use(
    cors({
        credentials: true,
        origin: origin
    })
)


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/schedules', getSchedules);
router.get('/current_user', auth.required, (req, res) => {
    const user = req.payload;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(200).json({user});
});
router.get('/myroutes', auth.required, getMyRoutes);
router.get('/myroutes/select', auth.required, selectMyRoutes);
router.post('/myroutes/update', auth.required, updateRoutes);
export default router;