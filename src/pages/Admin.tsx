import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { Photo } from "@/lib/types";
import { Navigation } from "@/components/Navigation";
import { AdminPhotoList } from "@/components/AdminPhotoList";
import { AdminPhotoForm } from "@/components/AdminPhotoForm";
import { compressImage } from "@/lib/imageUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const savedPhotos = localStorage.getItem("adminPhotos") || localStorage.getItem("photos");
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const savePhotos = (newPhotos: Photo[]) => {
    localStorage.setItem("adminPhotos", JSON.stringify(newPhotos));
    localStorage.setItem("photos", JSON.stringify(newPhotos));
  };

  const handleAddPhoto = async (photo: Photo) => {
    const photoWithYear = { ...photo, year: selectedYear };
    const newPhotos = [...photos, photoWithYear];
    setPhotos(newPhotos);
    savePhotos(newPhotos);
    toast({
      title: "Фото добавлено",
      description: `Фото "${photo.title}" успешно добавлено`,
    });
  };

  const handleUpdatePhoto = (updatedPhoto: Photo) => {
    const newPhotos = photos.map((photo) =>
      photo.id === updatedPhoto.id ? updatedPhoto : photo
    );
    setPhotos(newPhotos);
    savePhotos(newPhotos);
    setEditingPhoto(null);
    toast({
      title: "Фото обновлено",
      description: `Фото "${updatedPhoto.title}" успешно обновлено`,
    });
  };

  const handleDeletePhoto = (photoId: number) => {
    const newPhotos = photos.filter((photo) => photo.id !== photoId);
    setPhotos(newPhotos);
    savePhotos(newPhotos);
    toast({
      title: "Фото удалено",
      description: "Фото успешно удалено",
    });
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
  };

  const availableYears = Array.from(
    new Set(photos.map((photo) => photo.year || new Date().getFullYear()))
  ).sort((a, b) => b - a);

  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }

  const filteredPhotos = photos
    .filter(photo => !selectedCategory || photo.category === selectedCategory)
    .filter(photo => photo.year === selectedYear);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        
        <div className="mb-6">
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[180px] bg-gray-800 text-white">
              <SelectValue placeholder="Выберите год" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              {availableYears.map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  className="hover:bg-gray-700"
                >
                  {year} год
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdminPhotoList
              photos={filteredPhotos}
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onEdit={handleEditPhoto}
              onDelete={handleDeletePhoto}
            />
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <AdminPhotoForm 
              categories={CATEGORIES}
              onSubmit={editingPhoto ? handleUpdatePhoto : handleAddPhoto}
              editingPhoto={editingPhoto}
              onCancelEdit={handleCancelEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
