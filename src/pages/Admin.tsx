
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { Photo } from "@/lib/types";
import { Navigation } from "@/components/Navigation";
import { AdminPhotoList } from "@/components/AdminPhotoList";
import { AdminPhotoForm } from "@/components/AdminPhotoForm";
import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear] = useState<number>(2024);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    // Check authentication with server instead of localStorage
    const checkAuth = async () => {
      try {
        const isAuthenticated = await api.checkAuth();
        if (!isAuthenticated) {
          navigate("/admin-login");
        }
      } catch (error) {
        navigate("/admin-login");
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch photos
  const { data: photos = [] } = useQuery({
    queryKey: ['photos'],
    queryFn: api.getAllPhotos,
  });

  // Add photo mutation
  const addPhotoMutation = useMutation({
    mutationFn: (photo: FormData) => api.addPhoto(photo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Фото добавлено",
        description: "Фото успешно добавлено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить фото",
        variant: "destructive",
      });
    },
  });

  // Update photo mutation
  const updatePhotoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => 
      api.updatePhoto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      setEditingPhoto(null);
      toast({
        title: "Фото обновлено",
        description: "Фото успешно обновлено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить фото",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: number) => api.deletePhoto(photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
      toast({
        title: "Фото удалено",
        description: "Фото успешно удалено",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить фото",
        variant: "destructive",
      });
    },
  });

  const handleAddPhoto = async (photo: Photo) => {
    const formData = new FormData();
    formData.append('title', photo.title);
    formData.append('author', photo.author);
    formData.append('category', photo.category);
    formData.append('year', selectedYear.toString());
    if (photo.file) {
      formData.append('photo', photo.file);
    }
    addPhotoMutation.mutate(formData);
  };

  const handleUpdatePhoto = async (updatedPhoto: Photo) => {
    const formData = new FormData();
    formData.append('title', updatedPhoto.title);
    formData.append('author', updatedPhoto.author);
    formData.append('category', updatedPhoto.category);
    formData.append('year', selectedYear.toString());
    if (updatedPhoto.file) {
      formData.append('photo', updatedPhoto.file);
    }
    updatePhotoMutation.mutate({ 
      id: updatedPhoto.id, 
      data: formData 
    });
  };

  const handleDeletePhoto = (photoId: number) => {
    deletePhotoMutation.mutate(photoId);
  };

  const handleEditPhoto = (photo: Photo) => {
    setEditingPhoto(photo);
  };

  const handleCancelEdit = () => {
    setEditingPhoto(null);
  };

  const filteredPhotos = photos
    .filter(photo => !selectedCategory || photo.category === selectedCategory)
    .filter(photo => photo.year === selectedYear);

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
