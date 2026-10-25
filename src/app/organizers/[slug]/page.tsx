import { Suspense } from "react";
import { PublicOrganizerView } from "@/components/organizer/public-organizer-view";
import { SEEDED_ORGANIZER } from "@/lib/organizer-data";

export function generateStaticParams() {
  return [{ slug: SEEDED_ORGANIZER.slug }];
}

async function OrganizerPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicOrganizerView slug={slug} />;
}

export default function OrganizerPublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading Royal Organizer Showcase...</span>
          </div>
        </div>
      }
    >
      <OrganizerPageContent params={params} />
    </Suspense>
  );
}
