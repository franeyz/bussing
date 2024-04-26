import express from 'express';
const router = express.Router();
import cors from 'cors';
import {test,registerUser,loginUser, getSchedules} from '../controllers/controller.mjs';

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/schedules', getSchedules);

export default router;