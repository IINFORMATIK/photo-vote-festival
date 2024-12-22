import { Heart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoteButtonProps {
  photoId: number;
  votes: number;
  onVote: (photoId: number) => void;
}

export const VoteButton = ({ photoId, votes, onVote }: VoteButtonProps) => {
  const { toast } = useToast();

  const handleVote = () => {
    onVote(photoId);
    toast({
      title: "Спасибо за ваш голос!",
      description: "Ваш голос успешно учтен.",
    });
  };

  return (
    <button
      onClick={handleVote}
      className="flex items-center gap-2 bg-primary px-4 py-2 rounded-full hover:bg-primary-hover transition-colors duration-300"
    >
      <Heart className="w-4 h-4" />
      <span>{votes}</span>
    </button>
  );
};