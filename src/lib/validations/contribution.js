import { z } from 'zod';

export const contributionSchema = z.object({
  contribution_amount: z.coerce
    .number()
    .positive('Amount must be greater than 0'),
});
