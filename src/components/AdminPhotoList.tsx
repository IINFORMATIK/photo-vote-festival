
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Photo } from "@/lib/types";
import { LucideIcon } from "lucide-react";
import { CategoryFilter } from "@/components/CategoryFilter";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface AdminPhotoListProps {
  photos: Photo[];
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photoId: number) => void;
}

export const AdminPhotoList = ({
  photos,
  categories,
  selectedCategory,
  onSelectCategory,
  onEdit,
  onDelete,
}: AdminPhotoListProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Управление фотографиями</h2>
      
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
      
      {photos.length === 0 ? (
        <div className="text-center p-8 bg-gray-800 rounded-lg">
          <p>Нет фотографий{selectedCategory ? ' в выбранной категории' : ''}</p>
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Предпросмотр</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Голоса</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photos.map((photo) => (
                <TableRow key={photo.id}>
                  <TableCell>
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="h-12 w-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{photo.title}</TableCell>
                  <TableCell>{photo.author}</TableCell>
                  <TableCell>
                    {categories.find(c => c.id === photo.category)?.name || photo.category}
                  </TableCell>
                  <TableCell>{photo.votes}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(photo)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDelete(photo.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Удалить</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
