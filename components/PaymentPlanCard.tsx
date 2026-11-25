import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/dictionaries/en'
import { paymentPlanRows } from '@/lib/content/labels'
import { localize } from '@/lib/content/queries'
import type { PaymentPlan } from '@/lib/content/schema'

type Props = { locale: Locale; plan: PaymentPlan; dict: Pick<Dictionary, 'development'> }

export default function PaymentPlanCard({ locale, plan, dict }: Props) {
  return (
    <article className="border border-line bg-surface p-6 md:p-8">
      <h3 className="font-display text-3xl text-accent">{localize(plan.name, locale)}</h3>
      <dl className="mt-6 divide-y divide-line border-t border-line">
        {paymentPlanRows(plan, dict).map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 py-3 text-sm">
            <dt className="text-muted">{row.label}</dt>
            <dd className="text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
