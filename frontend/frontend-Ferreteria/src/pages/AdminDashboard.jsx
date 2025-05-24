import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleProviders = () => {
    navigate("/providers");
  };

  const handleProducts = () => {
    navigate("/products");
  };

  const handleBrands = () => {
    navigate("/brands");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Panel de Administración de EPA </h1>

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleProviders}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Ir a Proveedores
        </button>
        <button
          onClick={handleProducts}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Ir a Productos
        </button>
        <button
          onClick={handleBrands}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Ir a Marcas
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
