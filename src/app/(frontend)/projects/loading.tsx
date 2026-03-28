import { Container } from "@/components/layout";
import { SkeletonProjectCard } from "@/components/ui/SkeletonCard";

export default function ProjectsLoading() {
  return (
    <Container>
      <div className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonProjectCard key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}
