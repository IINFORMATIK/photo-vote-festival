import { Photo } from "@/lib/types";
import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  photos: Photo[];
  onVote: (photoId: number) => void;
}

export const PhotoGrid = ({ photos, onVote }: PhotoGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onVote={onVote} />
      ))}
    </div>
  );
};