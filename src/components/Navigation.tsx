import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">PhotoContest</h1>
        <div className="flex gap-4">
          <Link
            to="/"
            className={`text-white hover:text-primary transition-colors ${
              location.pathname === "/" ? "text-primary" : ""
            }`}
          >
            Галерея
          </Link>
          <Link
            to="/results"
            className={`text-white hover:text-primary transition-colors ${
              location.pathname === "/results" ? "text-primary" : ""
            }`}
          >
            Результаты
          </Link>
        </div>
      </div>
    </nav>
  );
};