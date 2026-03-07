import { notFound } from "next/navigation";
import { getLessonById } from "@/lib/lessonCatalog";
import { InteractiveLessonEngine } from "@/components/InteractiveLessonEngine";

export const dynamic = "force-dynamic";

type LessonPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = await getLessonById(id);

  if (!lesson) {
    notFound();
  }

  return <InteractiveLessonEngine lesson={lesson} />;
}
