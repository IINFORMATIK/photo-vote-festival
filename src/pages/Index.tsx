
import { useState, useEffect } from "react";
import { PhotoGrid } from "@/components/PhotoGrid";
import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { toast } from "sonner";
import { CATEGORIES } from "@/lib/constants";
import { CategoryFilter } from "@/components/CategoryFilter";

const Index = () => {
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
      title: "Горный пейзаж",
      author: "Иван Иванов",
      votes: 0,
      category: "nature",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538",
      title: "Морской закат",
      author: "Петр Петров",
      votes: 0,
      category: "nature",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1661956602116-aa6865609028",
      title: "Площадь города",
      author: "Анна Смирнова",
      votes: 0,
      category: "city",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7",
      title: "Ретро автомобиль",
      author: "Михаил Кузнецов",
      votes: 0,
      category: "retro",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce",
      title: "Научный эксперимент",
      author: "Елена Попова",
      votes: 0,
      category: "science",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1516522973472-f009f23bba59",
      title: "Семейный отдых",
      author: "Сергей Васильев",
      votes: 0,
      category: "family",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
      title: "Лиса в лесу",
      author: "Дарья Козлова",
      votes: 0,
      category: "animals",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1495462911434-be47104d70fa",
      title: "Радость победы",
      author: "Артем Морозов",
      votes: 0,
      category: "emotions",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1526306063970-d5498ad00f1c",
      title: "Творческий этюд",
      author: "Ольга Соколова",
      votes: 0,
      category: "free",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filteredPhotos = selectedCategory 
    ? photos.filter(photo => photo.category === selectedCategory) 
    : photos;

  return (
    <div className="min-h-screen bg-background">
      <Navigation photos={photos} />
      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">
          Фотоконкурс МОУ Раменская СОШ №9
        </h1>
        <CategoryFilter 
          categories={CATEGORIES} 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        <PhotoGrid photos={filteredPhotos} onVote={handleVote} />
      </main>
    </div>
  );
};

export default Index;
