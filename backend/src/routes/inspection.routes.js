import { Router } from 'express';
import { getInspectionCount, incrementInspectionCount } from '../controllers/inspection.controller.js';

const router = Router();

router.get('/', getInspectionCount);
router.post('/increment', incrementInspectionCount);

export default router;
