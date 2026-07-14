import { z } from 'zod';

export const withdrawalSchema = z.object({
  withdrawal_credit: z.coerce
    .number()
    .min(200, 'Minimum withdrawal is 200 credits'),
  payment_system: z.string().min(1, 'Please select a payment system'),
  account_number: z.string().min(3, 'Please enter a valid account number'),
});
