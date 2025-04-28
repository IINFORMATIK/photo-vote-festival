import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import { Photo } from "@/lib/types";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { ChevronDown } from "lucide-react";

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
  const availableYears = [2024, 2025];

  const handleResultsClick = () => {
    navigate("/results", { state: { photos } });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/");
  };

  const handleYearSelect = (year: number) => {
    localStorage.setItem("selectedYear", year.toString());
    window.location.reload();
  };

  return (
    <nav className="bg-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-primary">
            Фотоконкурс
          </Link>
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="font-medium text-sm cursor-pointer data-[state=open]:bg-accent/50">
                Год конкурса <ChevronDown className="h-4 w-4 ml-1" />
              </MenubarTrigger>
              <MenubarContent className="bg-card border border-border min-w-[200px]">
                {availableYears.map((year) => (
                  <MenubarItem
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className="cursor-pointer"
                  >
                    {year} год
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

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
