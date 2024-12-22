import { Navigation } from "@/components/Navigation";
import { Photo } from "@/lib/types";
import { useLocation } from "react-router-dom";
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
        <div className="bg-card rounded-lg p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white w-[100px]">Место</TableHead>
                <TableHead className="text-white">Фото</TableHead>
                <TableHead className="text-white">Название</TableHead>
                <TableHead className="text-white">Автор</TableHead>
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