import { PageBanner } from '../components/layout/PageBanner';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';

export function NotFound() {
  return (
    <>
      <PageBanner
        label="404"
        title="This page has moved on"
        description="The page you were looking for is not here. Our current collection and advisories are one click away."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Not found' }]}
      />
      <section className="bg-white py-16 lg:py-20">
        <div className="shell flex flex-wrap gap-4">
          <Button to="/" variant="primary" size="lg" icon={<Icon name="arrow-right" size={16} />}>
            Back to home
          </Button>
          <Button to="/properties" variant="outline" size="lg">
            Browse properties
          </Button>
        </div>
      </section>
    </>
  );
}
