import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { useLocation } from "react-router-dom";

const Results = () => {
  const location = useLocation();
  const photos: Photo[] = location.state?.photos || [];

  const sortedPhotos = [...photos].sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navigation />
      <main className="container mx-auto py-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Результаты голосования
        </h2>
        <div className="space-y-6">
          {sortedPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="flex items-center gap-6 bg-card p-4 rounded-lg"
            >
              <span className="text-2xl font-bold text-primary">#{index + 1}</span>
              <img
                src={photo.url}
                alt={photo.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-xl font-semibold">{photo.title}</h3>
                <p className="text-gray-400">by {photo.author}</p>
              </div>
              <div className="ml-auto">
                <span className="text-2xl font-bold text-primary">
                  {photo.votes} голосов
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Results;