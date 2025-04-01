
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload, LucideIcon } from "lucide-react";
import { Photo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface AdminPhotoFormProps {
  categories: Category[];
  onSubmit: (photo: Photo) => void;
  editingPhoto: Photo | null;
  onCancelEdit: () => void;
}

type FormValues = {
  title: string;
  author: string;
  category: string;
};

export const AdminPhotoForm = ({
  categories,
  onSubmit,
  editingPhoto,
  onCancelEdit,
}: AdminPhotoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      author: "",
      category: categories[0].id,
    },
  });
  
  useEffect(() => {
    if (editingPhoto) {
      form.reset({
        title: editingPhoto.title,
        author: editingPhoto.author,
        category: editingPhoto.category,
      });
      setPreviewUrl(editingPhoto.url);
    } else {
      form.reset({
        title: "",
        author: "",
        category: categories[0].id,
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [editingPhoto, categories, form]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Слишком большой файл",
          description: "Максимальный размер файла 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };
  
  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // For new photo or editing photo but changing the image
      let imageUrl = editingPhoto?.url || "";
      
      if (selectedFile) {
        // Convert file to base64 string for storage in localStorage
        const reader = new FileReader();
        const base64String = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64);
          };
          reader.readAsDataURL(selectedFile);
        });
        
        imageUrl = base64String;
      }
      
      if (!imageUrl && !editingPhoto) {
        toast({
          title: "Нужно выбрать фото",
          description: "Пожалуйста, загрузите фотографию",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const photoData: Photo = {
        id: editingPhoto ? editingPhoto.id : Date.now(),
        title: data.title,
        author: data.author,
        url: imageUrl,
        category: data.category,
        votes: editingPhoto ? editingPhoto.votes : 0,
      };
      
      onSubmit(photoData);
      
      if (!editingPhoto) {
        form.reset({
          title: "",
          author: "",
          category: categories[0].id,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Error submitting photo:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить фото",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {editingPhoto ? "Редактировать фото" : "Добавить новое фото"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="mb-4">
            <p className="mb-2">Фотография</p>
            <div className="flex flex-col items-center">
              {previewUrl ? (
                <div className="mb-4 w-full">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md" 
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-700 rounded-md flex items-center justify-center mb-4">
                  <p className="text-gray-400">Нет выбранного изображения</p>
                </div>
              )}
              
              <label className="w-full">
                <div className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-500 rounded-md cursor-pointer hover:bg-gray-700">
                  <Upload size={20} />
                  <span>Выбрать файл</span>
                </div>
                <Input 
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Автор</FormLabel>
                <FormControl>
                  <Input placeholder="Имя автора" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Категория</FormLabel>
                <FormControl>
                  <select
                    className="w-full h-10 px-3 py-2 text-base bg-background border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...field}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-2">
            {editingPhoto && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancelEdit}
              >
                Отмена
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={editingPhoto ? "" : "w-full"}
            >
              {isSubmitting
                ? "Сохранение..."
                : editingPhoto
                ? "Сохранить изменения"
                : "Добавить фото"
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
