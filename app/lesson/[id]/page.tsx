import { notFound } from "next/navigation";
import { getLessonById } from "@/constants/lessons";
import { InteractiveLessonEngine } from "@/components/InteractiveLessonEngine";

type LessonPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = getLessonById(id);

  if (!lesson) {
    notFound();
  }

  return <InteractiveLessonEngine lesson={lesson} />;
}
