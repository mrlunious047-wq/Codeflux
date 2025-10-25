import express from 'express';
import { generateCode } from '../services/aiService.js';
import { authenticateToken } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  projectId: z.string().optional(),
});

router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { message, projectId } = chatSchema.parse(req.body);
    const userId = req.user.uid;

    const result = await generateCode(message, userId, projectId);
    
    res.json({
      success: true,
      message: result.message,
      code: result.code,
      language: result.language,
      projectId: result.projectId
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to process message'
    });
  }
});

export default router;
