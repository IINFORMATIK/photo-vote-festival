
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import { Photo } from "@/lib/types";

interface NavigationProps {
  photos?: Photo[];
}

export const Navigation = ({ photos }: NavigationProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isResultsPage = location.pathname === "/results";
  const isAdminPage = location.pathname === "/admin";

  const handleResultsClick = () => {
    navigate("/results", { state: { photos } });
  };

  return (
    <nav className="bg-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          Фотоконкурс
        </Link>
        <div className="flex gap-2">
          {!isAdminPage && (
            <Button
              variant="outline"
              onClick={handleResultsClick}
              className="text-primary hover:text-primary-hover"
            >
              {isResultsPage ? "Вернуться к голосованию" : "Посмотреть результаты"}
            </Button>
          )}
          
          {!isAdminPage ? (
            <Link to="/admin">
              <Button variant="default">
                Админ панель
              </Button>
            </Link>
          ) : (
            <Link to="/">
              <Button variant="outline">
                Вернуться на сайт
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
