import type { Dictionary } from '@/i18n/dictionaries/en'
import type { PaymentPlan, Development } from './schema'

// Helpers puros: reciben el diccionario ya resuelto para poder probarse sin Next.

export function statusLabel(status: Development['status'], dict: Pick<Dictionary, 'status'>): string {
  return dict.status[status]
}

export function cityLabel(city: Development['city'], dict: Pick<Dictionary, 'cities'>): string {
  return dict.cities[city]
}

export type LabeledValue = { label: string; value: string }

/** Filas de un plan de pagos; las mensualidades en 0% se muestran como «—». */
export function paymentPlanRows(plan: PaymentPlan, dict: Pick<Dictionary, 'development'>): LabeledValue[] {
  const d = dict.development
  return [
    { label: d.downPayment, value: `${plan.downPaymentPct}%` },
    {
      label: d.installments,
      value: plan.installmentsPct > 0 ? `${plan.installmentsPct}% · ${plan.installmentsMonths} ${d.months}` : '—',
    },
    { label: d.onDelivery, value: `${plan.onDeliveryPct}%` },
    { label: d.discount, value: `${plan.discountPct}%` },
  ]
}
