import { AffiliateLink } from './AffiliateLink'

export function CtaSection({
  title = 'Start Selling Feet Pics Online With Snifffr Today',
  text = 'Join the thousands of creators who rely on Snifffr to sell feet pictures safely, privately, and profitably. Your next income stream is a single click away.',
  button = 'Join Snifffr and Start Earning',
}: {
  title?: string
  text?: string
  button?: string
}) {
  return (
    <section className="final">
      <div className="wrap">
        <h2>{title}</h2>
        <p>{text}</p>
        <div style={{ marginTop: 24 }}>
          <AffiliateLink>{button}</AffiliateLink>
        </div>
      </div>
    </section>
  )
}
