import { z } from 'zod'
import { BudgetCategory, PaymentStatus } from '@/shared'

const optionalNumber = z.number().min(0, 'Cost cannot be negative').optional()

export const budgetSchema = z
  .object({
    itemName: z.string().trim().min(1, 'Item name is required').max(200),
    category: z.enum(Object.values(BudgetCategory) as [BudgetCategory, ...BudgetCategory[]]),
    estimatedCost: z.number().min(0, 'Estimated cost cannot be negative'),
    actualCost: optionalNumber,
    paymentStatus: z.enum(Object.values(PaymentStatus) as [PaymentStatus, ...PaymentStatus[]]),
  })
  .refine(
    (values) =>
      values.paymentStatus !== PaymentStatus.PAID ||
      typeof values.actualCost === 'number',
    {
      path: ['actualCost'],
      message: 'Actual cost is required when payment status is Paid',
    },
  )

export type BudgetFormValues = z.infer<typeof budgetSchema>

export const toBudgetRequestData = (values: BudgetFormValues) => ({
  itemName: values.itemName,
  category: values.category,
  estimatedCost: values.estimatedCost,
  actualCost: values.actualCost ?? null,
  paymentStatus: values.paymentStatus,
})
