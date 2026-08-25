import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 px-8 py-32 text-center">
      <p className="font-mono text-sm font-semibold text-muted-foreground">404</p>
      <h1 className="font-display text-3xl font-semibold text-foreground">This page didn't make the map.</h1>
      <p className="max-w-sm text-[14.5px] text-muted-foreground">The page you're looking for doesn't exist or may have moved.</p>
      <Button asChild className="mt-2">
        <Link to="/">Back to home</Link>
      </Button>
    </section>
  );
}
