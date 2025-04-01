
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  
  const handleCategoryClick = (categoryId: string) => {
    onSelectCategory(selectedCategory === categoryId ? null : categoryId);
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Номинации</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2", 
                isSelected ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
              onClick={() => handleCategoryClick(category.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
