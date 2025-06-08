
import { useState, useEffect } from "react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { CategoryFilter } from "@/components/CategoryFilter";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Fetch photos from server
  const { data: photos = [] } = useQuery({
    queryKey: ['photos'],
    queryFn: api.getAllPhotos,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (photoId: number) => api.votePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast.success("Ваш голос учтен!");
    },
    onError: (error) => {
      if (error.message.includes('already voted')) {
        toast.error("Вы уже голосовали за эту фотографию");
      } else {
        toast.error("Ошибка при голосовании");
      }
    },
  });

  const availableYears = Array.from(
    new Set(photos.map((photo) => photo.year || new Date().getFullYear()))
  ).sort((a, b) => b - a);

  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  const handleVote = (photoId: number) => {
    voteMutation.mutate(photoId);
  };

  const filteredPhotos = photos
    .filter(photo => !selectedCategory || photo.category === selectedCategory)
    .filter(photo => photo.year === selectedYear);

  return (
    <div className="min-h-screen bg-background">
      <Navigation photos={photos} />
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Фотоконкурс МОУ Раменская СОШ №9
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CategoryFilter 
            categories={CATEGORIES} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>

        <PhotoGrid photos={filteredPhotos} onVote={handleVote} />
      </main>
    </div>
  );
};

export default Index;
