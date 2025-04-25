
import { Photo } from "@/lib/types";
import { VoteButton } from "./VoteButton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getCompressedImageUrl } from "@/lib/imageUtils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PhotoCardProps {
  photo: Photo;
  onVote: (photoId: number) => void;
}

export const PhotoCard = ({ photo, onVote }: PhotoCardProps) => {
  const compressedUrl = getCompressedImageUrl(photo.url);
  
  return (
    <div className="relative group overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl">
      <Dialog>
        <DialogTrigger className="w-full">
          <AspectRatio ratio={4/3} className="bg-muted">
            <img
              src={compressedUrl}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </AspectRatio>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
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
