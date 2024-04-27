import express from 'express';
const router = express.Router();
import cors from 'cors';
import {test,registerUser,loginUser, getSchedules} from '../controllers/controller.mjs';

const origin = process.env.CLIENT ?? 'http://localhost:5173';

router.use(
    cors({
        credentials: true,
        origin: origin
    })
)

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/schedules', getSchedules);

export default router;