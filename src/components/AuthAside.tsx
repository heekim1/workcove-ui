type AuthAsideProps = {
  title: string
  body: string
  imageSrc: string
  imageAlt?: string
}

export function AuthAside({ title, body, imageSrc, imageAlt = '' }: AuthAsideProps) {
  return (
    <aside className="auth-aside" aria-hidden={imageAlt ? undefined : true}>
      <img className="auth-aside__image" src={imageSrc} alt={imageAlt} />
      <div className="auth-aside__scrim" />
      <div className="auth-aside__glow" />
      <div className="auth-aside__content">
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </aside>
  )
}
