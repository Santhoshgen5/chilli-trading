import { Seo } from '../components/Seo'
import { Container, Section } from '../components/Section'
import { Button } from '../components/Button'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found — MAVEH WORLD"
        description="The page you were looking for could not be found."
        path="/404"
        noindex
      />
      <Section className="py-24 sm:py-32">
        <Container>
          <p className="font-mono text-sm uppercase tracking-label text-navy-400">Error 404</p>
          <h1 className="mt-4 text-4xl sm:text-5xl">Page not found</h1>
          <p className="mt-4 max-w-prose text-lg text-navy-500">
            The page you were looking for isn&rsquo;t here. Head back to the products, or send us an enquiry.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/products" size="lg">View products</Button>
            <Button to="/enquiry" size="lg" variant="secondary">Request a quote</Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
