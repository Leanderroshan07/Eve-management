import { Suspense } from "react";
import { PublicWorkerView } from "@/components/worker/public-worker-view";
import { getWorkerById, SEEDED_WORKERS_DATA } from "@/lib/worker-data";
import { Metadata } from "next";

export function generateStaticParams() {
  return SEEDED_WORKERS_DATA.map((w) => ({ id: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const worker = getWorkerById(id) || SEEDED_WORKERS_DATA[0];

  return {
    title: `${worker.full_name} — ${worker.role_title} | Veluxe`,
    description: worker.bio,
  };
}

async function WorkerPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicWorkerView id={id} />;
}

export default function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading Artisan Profile...</span>
          </div>
        </div>
      }
    >
      <WorkerPageContent params={params} />
    </Suspense>
  );
}
