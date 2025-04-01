
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
  const isAdminLoginPage = location.pathname === "/admin-login";
  const isAdmin = localStorage.getItem("adminAuthenticated") === "true";

  const handleResultsClick = () => {
    navigate("/results", { state: { photos } });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/");
  };

  return (
    <nav className="bg-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">
          Фотоконкурс
        </Link>
        <div className="flex gap-2">
          {!isAdminPage && !isAdminLoginPage && (
            <Button
              variant="outline"
              onClick={handleResultsClick}
              className="text-primary hover:text-primary-hover"
            >
              {isResultsPage ? "Вернуться к голосованию" : "Посмотреть результаты"}
            </Button>
          )}
          
          {isAdmin ? (
            <>
              {!isAdminPage ? (
                <Link to="/admin">
                  <Button variant="default">
                    Админ панель
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" onClick={handleLogout}>
                  Выйти
                </Button>
              )}
            </>
          ) : (
            <>
              {!isAdminLoginPage && (
                <Link to="/admin-login">
                  <Button variant="default">
                    Админ панель
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
