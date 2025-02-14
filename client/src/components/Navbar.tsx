import { FaUser } from "react-icons/fa";
import { useAuth } from "../contexts/authContext";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        {user && (
          <button
            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
            type="button"
          >
            Profil de {user.username}
            <FaUser className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
