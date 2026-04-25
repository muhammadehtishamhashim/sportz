import { z } from 'zod';

// Helper function to validate ISO date strings
const isValidISODate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString();
};

// Constant for match statuses
export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
};

// Schema for listing matches with optional limit
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// Schema for match ID parameter
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Schema for creating a match
export const createMatchSchema = z.object({
  sport: z.string().min(1, 'Sport is required'),
  homeTeam: z.string().min(1, 'Home team is required'),
  awayTeam: z.string().min(1, 'Away team is required'),
  startTime: z.string().refine(isValidISODate, 'Start time must be a valid ISO date string'),
  endTime: z.string().refine(isValidISODate, 'End time must be a valid ISO date string'),
  homeScore: z.coerce.number().int().min(0).optional(),
  awayScore: z.coerce.number().int().min(0).optional(),
}).superRefine((data, ctx) => {
  const startDate = new Date(data.startTime);
  const endDate = new Date(data.endTime);
  if (endDate <= startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End time must be after start time',
      path: ['endTime'],
    });
  }
});

// Schema for updating match scores
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});