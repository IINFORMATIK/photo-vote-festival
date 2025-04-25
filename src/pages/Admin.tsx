
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { Photo } from "@/lib/types";
import { Navigation } from "@/components/Navigation";
import { AdminPhotoList } from "@/components/AdminPhotoList";
import { AdminPhotoForm } from "@/components/AdminPhotoForm";
import { compressImage } from "@/lib/imageUtils";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const savedPhotos = localStorage.getItem("adminPhotos") || localStorage.getItem("photos");
    return savedPhotos ? JSON.parse(savedPhotos) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/admin-login");
    }
  }, [navigate]);

  // Save photos to both admin and public storage
  const savePhotos = (newPhotos: Photo[]) => {
    localStorage.setItem("adminPhotos", JSON.stringify(newPhotos));
    localStorage.setItem("photos", JSON.stringify(newPhotos));
  };

  const handleAddPhoto = async (photo: Photo) => {
    const newPhotos = [...photos, photo];
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        
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
