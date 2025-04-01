
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { Photo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

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
  url: string;
  category: string;
};

export const AdminPhotoForm = ({
  categories,
  onSubmit,
  editingPhoto,
  onCancelEdit,
}: AdminPhotoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      author: "",
      url: "",
      category: categories[0].id,
    },
  });
  
  useEffect(() => {
    if (editingPhoto) {
      form.reset({
        title: editingPhoto.title,
        author: editingPhoto.author,
        url: editingPhoto.url,
        category: editingPhoto.category,
      });
    } else {
      form.reset({
        title: "",
        author: "",
        url: "",
        category: categories[0].id,
      });
    }
  }, [editingPhoto, categories, form]);
  
  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const photoData: Photo = {
        id: editingPhoto ? editingPhoto.id : Date.now(),
        title: data.title,
        author: data.author,
        url: data.url,
        category: data.category,
        votes: editingPhoto ? editingPhoto.votes : 0,
      };
      
      onSubmit(photoData);
      if (!editingPhoto) {
        form.reset({
          title: "",
          author: "",
          url: "",
          category: categories[0].id,
        });
      }
    } catch (error) {
      console.error("Error submitting photo:", error);
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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL изображения</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} />
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
