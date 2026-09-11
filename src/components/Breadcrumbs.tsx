import { Link } from 'react-router-dom'

export type BreadcrumbItem = {
  label: string
  to?: string
}

type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  label: string
  className?: string
}

export function Breadcrumbs({ items, label, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`blog-breadcrumbs ${className}`.trim()} aria-label={label}>
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1
        return (
          <span className="blog-breadcrumbs__item" key={`${item.to || 'current'}-${item.label}`}>
            {index > 0 && <span className="blog-breadcrumbs__separator" aria-hidden="true">/</span>}
            {!isCurrent && item.to
              ? <Link to={item.to}>{item.label}</Link>
              : <span aria-current={isCurrent ? 'page' : undefined}>{item.label}</span>}
          </span>
        )
      })}
    </nav>
  )
}
