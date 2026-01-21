// routes/adminRoutes.js

import express from 'express';
import { loginAdmin, getStats } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/stats', getStats); // We'll protect this route later

export default router;