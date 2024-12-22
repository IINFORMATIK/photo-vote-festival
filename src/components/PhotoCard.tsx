import { Photo } from "@/lib/types";
import { VoteButton } from "./VoteButton";

interface PhotoCardProps {
  photo: Photo;
  onVote: (photoId: number) => void;
}

export const PhotoCard = ({ photo, onVote }: PhotoCardProps) => {
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl">
      <img
        src={photo.url}
        alt={photo.title}
        className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold mb-1">{photo.title}</h3>
          <p className="text-sm opacity-90 mb-2">by {photo.author}</p>
          <VoteButton photoId={photo.id} votes={photo.votes} onVote={onVote} />
        </div>
      </div>
    </div>
  );
};