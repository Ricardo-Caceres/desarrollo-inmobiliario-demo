type Props = { eyebrow?: string; title: string; as?: 'h2' | 'h3'; className?: string }

export default function SectionHeading({ eyebrow, title, as: Tag = 'h2', className = '' }: Props) {
  return (
    <div className={className}>
      {eyebrow && <p className="text-xs uppercase tracking-[0.25em] text-accent">{eyebrow}</p>}
      <Tag className="mt-3 font-display text-4xl leading-tight md:text-5xl">{title}</Tag>
    </div>
  )
}
