import type { Dictionary } from '@/i18n/dictionaries/en'
import { PORTFOLIO_URL, REPO_URL } from '@/lib/site'

type Props = { dict: Dictionary['footer'] }

export default function SiteFooter({ dict }: Props) {
  const linkClass = 'underline underline-offset-2 hover:text-accent'

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted">
        <p>{dict.disclaimer}</p>
        <p className="flex gap-4">
          <a className={linkClass} href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer">
            {dict.portfolio}
          </a>
          <a className={linkClass} href={REPO_URL} target="_blank" rel="noopener noreferrer">
            {dict.repo}
          </a>
        </p>
      </div>
    </footer>
  )
}
