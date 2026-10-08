import Seo from '../components/Seo';
import Section from '../components/Section';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for does not exist." path="/404" />
      <Section className="text-center">
        <p className="font-display text-6xl font-bold text-gradient">404</p>
        <h1 className="mt-4 text-3xl font-bold">We could not find that page</h1>
        <p className="mt-3 text-muted">It may have moved, or the link may be wrong.</p>
        <Button to="/" className="mt-8">Back to home</Button>
      </Section>
    </>
  );
}
