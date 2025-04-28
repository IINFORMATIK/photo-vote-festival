import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { useLocation } from "react-router-dom";
import { CATEGORIES } from "@/lib/constants";
import { CategoryFilter } from "@/components/CategoryFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Results = () => {
  const location = useLocation();
  const photos: Photo[] = location.state?.photos || [];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear] = useState<number>(() => {
    const savedYear = localStorage.getItem("selectedYear");
    return savedYear ? parseInt(savedYear) : 2024;
  });

  const getCategoryName = (categoryId: string) => {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : "Неизвестная категория";
  };

  const filteredPhotos = photos
    .filter(photo => !selectedCategory || photo.category === selectedCategory)
    .filter(photo => photo.year === selectedYear);

  const sortedPhotos = [...filteredPhotos].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />
      <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Результаты голосования
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <CategoryFilter 
            categories={CATEGORIES} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
        
        <div className="bg-card rounded-lg p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white w-[100px]">Место</TableHead>
                <TableHead className="text-white">Фото</TableHead>
                <TableHead className="text-white">Название</TableHead>
                <TableHead className="text-white">Автор</TableHead>
                <TableHead className="text-white">Категория</TableHead>
                <TableHead className="text-white text-right">Голоса</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPhotos.map((photo, index) => (
                <TableRow key={photo.id}>
                  <TableCell className="font-medium text-primary">
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{photo.title}</TableCell>
                  <TableCell>{photo.author}</TableCell>
                  <TableCell>{getCategoryName(photo.category)}</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {photo.votes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Results;
