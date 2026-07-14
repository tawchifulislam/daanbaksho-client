import { z } from 'zod';

export const campaignSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  story: z.string().min(20, 'Story must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  funding_goal: z.coerce
    .number()
    .positive('Funding goal must be greater than 0'),
  minimum_contribution: z.coerce
    .number()
    .positive('Minimum contribution must be greater than 0'),
  deadline: z.string().min(1, 'Please select a deadline'),
  reward_info: z
    .string()
    .min(5, 'Please describe what supporters will receive'),
});
