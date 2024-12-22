import { useState, useEffect } from "react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { toast } from "sonner";

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
      title: "Горный пейзаж",
      author: "Иван Иванов",
      votes: 0,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
      title: "Морской закат",
      author: "Петр Петров",
      votes: 0,
    },
    // Добавьте больше фотографий по необходимости
  ]);

  useEffect(() => {
    // Загрузка сохраненных голосов из localStorage
    const savedPhotos = localStorage.getItem("photos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  const handleVote = (photoId: number) => {
    const votedPhotos = localStorage.getItem("votedPhotos");
    const votedPhotoIds = votedPhotos ? JSON.parse(votedPhotos) : [];

    if (votedPhotoIds.includes(photoId)) {
      toast.error("Вы уже голосовали за эту фотографию");
      return;
    }

    const updatedPhotos = photos.map((photo) =>
      photo.id === photoId ? { ...photo, votes: photo.votes + 1 } : photo
    );

    setPhotos(updatedPhotos);
    localStorage.setItem("photos", JSON.stringify(updatedPhotos));
    localStorage.setItem(
      "votedPhotos",
      JSON.stringify([...votedPhotoIds, photoId])
    );
    toast.success("Ваш голос учтен!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation photos={photos} />
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Фотоконкурс
        </h1>
        <PhotoGrid photos={photos} onVote={handleVote} />
      </main>
    </div>
  );
};

export default Index;