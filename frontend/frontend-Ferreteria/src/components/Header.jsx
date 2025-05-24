import React from "react";
import Logo from "../components/Logo";
import { FaTools, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom"; // Asegúrate de usar React Router

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
        
        {/* Logo + Nombre */}
        <div className="flex items-center gap-4">
          <Logo />
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FaTools className="text-yellow-400" />
              Ferretería EPA
            </h1>
            <p className="text-sm text-gray-300 italic">administra EPA  </p>
          </div>
        </div>

        {/* Links de navegación */}
        <nav className="flex gap-6 items-center text-sm font-medium">
          <Link
            to="/"
            className="hover:text-yellow-400 transition duration-200"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            className="hover:text-yellow-400 transition duration-200"
          >
            Productos
          </Link>
          <Link
            to="/brands"
            className="hover:text-yellow-400 transition duration-200"
          >
            marcas
          </Link>
          <Link
            to="/providers"
            className="hover:text-yellow-400 transition duration-200"
          >
            Proveedores
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
