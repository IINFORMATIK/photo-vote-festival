import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Photo } from "@/lib/types";
import { toast } from "sonner";

const initialPhotos: Photo[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    title: "Горный пейзаж",
    author: "John Doe",
    votes: 15,
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    title: "Закат на море",
    author: "Jane Smith",
    votes: 12,
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    title: "Лесное озеро",
    author: "Mike Johnson",
    votes: 18,
  },
];

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [votedPhotos, setVotedPhotos] = useState<number[]>([]);

  // Load voted photos from localStorage on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem("votedPhotos");
    if (savedVotes) {
      setVotedPhotos(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = (photoId: number) => {
    // Check if user has already voted for this photo
    if (votedPhotos.includes(photoId)) {
      toast.error("Вы уже голосовали за эту фотографию");
      return;
    }

    // Update photos with new vote
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === photoId ? { ...photo, votes: photo.votes + 1 } : photo
      )
    );

    // Save voted photo to localStorage
    const newVotedPhotos = [...votedPhotos, photoId];
    setVotedPhotos(newVotedPhotos);
    localStorage.setItem("votedPhotos", JSON.stringify(newVotedPhotos));

    toast.success("Спасибо за ваш голос!");
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />
      <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Фотоконкурс: Природа
        </h2>
        <PhotoGrid photos={photos} onVote={handleVote} />
      </main>
    </div>
  );
};

export default Index;