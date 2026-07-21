import ExploreCampaignsGrid from '@/components/campaigns/ExploreCampaignsGrid';
import Container from '@/components/layout/Container';

export default function PublicCampaignsPage() {
  return (
    <Container className="py-10">
      <ExploreCampaignsGrid />
    </Container>
  );
}
