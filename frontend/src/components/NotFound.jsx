import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="glass-card p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-gradient mb-4">OOPS...</h1>
        <img src="src/assets/undraw_more-music_1188.svg" alt="" />
        <p className="text-gray-300 mt-2 text-base">
          Sembra che la pagina si sia persa nella playlist.
        </p>
        <p className="text-gray-300 mb-6 text-base">
          Riproviamo con un’altra traccia!
        </p>
        <Link
          to="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
