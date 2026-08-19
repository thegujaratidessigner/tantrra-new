import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto max-w-md text-center">
          <p className="font-heading text-7xl font-bold text-gold/30">404</p>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-foreground">
            Page Not Found
          </h1>
          <p className="mt-3 text-foreground-muted">
            The page you are looking for does not exist or has been moved.
          </p>
          <Button
            href="/"
            variant="primary-green"
            size="lg"
            className="mt-6"
            withArrow
          >
            Return Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
