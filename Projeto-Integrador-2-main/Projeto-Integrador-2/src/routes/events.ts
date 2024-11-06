import express, { Request, Response } from 'express';
import Event from '../models/Event';

const router = express.Router();

// Add New Event
router.post('/addNewEvent', async (req: Request, res: Response)