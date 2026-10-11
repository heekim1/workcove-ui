type AlertProps = {
  tone?: 'error' | 'success' | 'info'
  children: React.ReactNode
}

export function Alert({ tone = 'error', children }: AlertProps) {
  return (
    <div className={`alert alert--${tone}`} role="alert">
      {children}
    </div>
  )
}
