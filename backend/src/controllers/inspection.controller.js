import { Router } from 'express';

let inspectionCount = 1; // Start with 1 inspection

// Get current inspection count
export const getInspectionCount = (req, res) => {
  try {
    res.status(200).json({ count: inspectionCount });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inspection count' });
  }
};

// Increment inspection count
export const incrementInspectionCount = (req, res) => {
  try {
    inspectionCount++;
    res.status(200).json({ count: inspectionCount });
  } catch (error) {
    res.status(500).json({ message: 'Error updating inspection count' });
  }
};

const router = Router();

router.get('/', getInspectionCount);
router.post('/increment', incrementInspectionCount);

export default router;
